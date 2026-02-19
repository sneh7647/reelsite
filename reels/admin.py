from django.contrib import admin
from django.utils.timezone import localtime
from .models import Reel, View, Like

# Register your models here.


@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'total_likes', 'total_views')


@admin.register(View)
class ViewAdmin(admin.ModelAdmin):
    list_display = ('reel', 'formatted_time')

    def formatted_time(self, obj):
        return localtime(obj.watched_at).strftime("%d-%m-%Y %I:%M:%S %p")

    formatted_time.short_description = "Watched At"


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('reel', 'formatted_time')
    
    def formatted_time(self, obj):
        return localtime(obj.liked_at).strftime("%d-%m-%Y %I:%M:%S %p")

    formatted_time.short_description = "Liked At"