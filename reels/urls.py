from django.urls import path
from . import views

urlpatterns = [
    path('', views.reel_feed, name='reel_feed'),
    path('like/<int:reel_id>/', views.like_reel, name='like_reel'),
    path('view/<int:reel_id>/', views.add_view, name='add_view'),
]
