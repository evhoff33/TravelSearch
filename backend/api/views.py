from django.shortcuts import render
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
import json
import os
from api.api_calls.api_calls_amadeus import *
from api.functions.get_location_info import *
from api.functions.airport_to_code import *
from api.api_calls.get_airports import *
from api.api_calls.find_flights import *
from api.api_calls.get_cars import *
from .models import SavedSearch
from .serializers import SavedSearchSerializer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

#--DEBUG
USE_TEST_DATA = True

#--ACCOUNT MANAGEMENT VIEWS
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CreateUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response(status=204)

#--API DATA VIEWS
class GetAirportsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        search_string = request.query_params.get('search_string', '')
        if not search_string:
            return Response({'error': 'Search string parameter is required'}, status=400)
        
        try:
            airports_data = get_airports(search_string)
            return Response(airports_data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

        
class GetFlightsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not USE_TEST_DATA:
            airport_code_from = request.query_params.get('airport_code_from', '')
            airport_code_to = request.query_params.get('airport_code_to', '')
            date = request.query_params.get('date', '')
            if not airport_code_from or not airport_code_to:
                return Response({'error': 'Both airport_code_from and airport_code_to parameters are required'}, status=400)
            
            try:
                flights_data = find_flights(airport_code_from, airport_code_to, date)
                return Response(flights_data)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        else:
            try:
                data_file_path = os.path.join(BASE_DIR, 'api', 'test_data', 'flight_data.json')
                with open(data_file_path, 'r') as file:
                    flights_data = json.load(file)
                return Response(flights_data)
            except Exception as e:
                return Response({'error': str(e)}, status=500)


class HotelsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not USE_TEST_DATA:
            location = request.query_params.get('location', '')
            radius = request.query_params.get('radius', 5)
            if not location:
                return Response({'error': 'Location parameter is required'}, status=400)
            
            try:
                location_info = get_location_info(location)
                if location_info:
                    hotels_data = get_hotels(location_info[0], location_info[1], radius)
                    return Response(hotels_data)
                else:
                    return Response({'error': 'Location not found'}, status=404)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        else: #Load Local File
            try:
                data_file_path = os.path.join(BASE_DIR, 'api', 'test_data', 'hotel_data.json')
                with open(data_file_path, 'r') as file:
                    hotels_data = json.load(file)
                return Response(hotels_data)
            except Exception as e:
                return Response({'error': str(e)}, status=500)

class AttractionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not USE_TEST_DATA:
            location = request.query_params.get('location', '')
            radius = request.query_params.get('radius', 5)
            if not location:
                return Response({'error': 'Location parameter is required'}, status=400)
            
            try:
                location_info = get_location_info(location)
                if location_info:
                    attractions_data = get_attrs(location_info[0], location_info[1], radius)
                    return Response(attractions_data)
                else:
                    return Response({'error': 'Location not found'}, status=404)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        else:
            try:
                data_file_path = os.path.join(BASE_DIR, 'api', 'test_data', 'activities_data.json')
                with open(data_file_path, 'r') as file:
                    attractions_data = json.load(file)
                return Response(attractions_data)
            except Exception as e:
                return Response({'error': str(e)}, status=500)

class GetCarsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Get the query parameters
        pickup_location = request.query_params.get('pickupLocation', '')
        pickup_date = request.query_params.get('pickupDate', '')
        dropoff_date = request.query_params.get('dropoffDate', '')
        pickup_time = request.query_params.get('pickupTime', '')
        dropoff_time = request.query_params.get('dropoffTime', '')

        # error
        if not pickup_location or not pickup_date or not dropoff_date or not pickup_time or not dropoff_time:
            return Response({'error' : 'All parameters must be present'}, status=400)

        # Call the car rental API function
        try:
            car_data = find_cars(pickup_location, pickup_date, dropoff_date, pickup_time, dropoff_time)
            if isinstance(car_data, dict) and "error" in car_data:
                return Response(car_data, status=500)
            return Response(car_data, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class SavedSearchViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SavedSearchSerializer

    def get_queryset(self):
        return SavedSearch.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



