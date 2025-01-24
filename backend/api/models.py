from django.db import models
from django.contrib.auth.models import User

class SavedSearch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    search_date = models.DateTimeField(auto_now_add=True)
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    search_params = models.JSONField()  # Store additional parameters