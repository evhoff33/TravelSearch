from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from . import views


router = DefaultRouter()
router.register(r'saved-searches', views.SavedSearchViewSet, basename='saved-searches')

urlpatterns = [
    path('user/', views.UserDetailView.as_view(), name='user-detail'),
    path('attractions/', views.AttractionsView.as_view(), name='attractions'),
    path('hotels/', views.HotelsView.as_view(), name='hotels'),
    path('getairports/', views.GetAirportsView.as_view(), name='getairports'),
    path('getflights/', views.GetFlightsView.as_view(), name='getflights'),
    path('cars/', views.GetCarsView.as_view(), name='get_cars'),
    path('', include(router.urls)),
]
