from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User

class UserDetailViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_user_detail(self):
        response = self.client.get(reverse('user-detail'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_update_user_detail(self):
        data = {'first_name': 'UpdatedName'}
        response = self.client.put(reverse('user-detail'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'UpdatedName')

    def test_delete_user(self):
        response = self.client.delete(reverse('user-detail'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username='testuser').exists())

# class AttractionsViewTests(APITestCase):
#     def test_get_attractions(self):
#         response = self.client.get(reverse('attractions'), {'location': 'Paris', 'radius': 5})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

# class HotelsViewTests(APITestCase):
#     def test_get_hotels(self):
#         response = self.client.get(reverse('hotels'), {'location': 'Paris', 'radius': 5})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

class GetAirportsViewTests(APITestCase):
    def test_get_airports(self):
        response = self.client.get(reverse('getairports'), {'search_string': 'omaha'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    #this shouldn't work because gitlab doesnt have the API key but the test still passes for some reason
    def test_get_airports_no_params(self):
        response = self.client.get(reverse('getairports'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# class GetFlightsViewTests(APITestCase):
#     def test_get_flights(self):
#         response = self.client.get(reverse('getflights'))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
