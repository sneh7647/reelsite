from django.db import models
from django.utils import timezone

# Create your models here.


class Reel(models.Model):
    title = models.CharField(max_length=200)
    video = models.FileField(upload_to='reels/')
    # likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def total_likes(self):
        return self.likes.count()
    
    def total_views(self):
        return self.views.count()

    def __str__(self):
        return self.title


class Like(models.Model):
    reel = models.ForeignKey(Reel, related_name='likes', on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)
    liked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('reel', 'ip_address')
    
    def __str__(self):
        return f"{self.reel.title} - {self.liked_at}"


class View(models.Model):
    reel = models.ForeignKey(Reel, related_name='views', on_delete=models.CASCADE)
    watched_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.reel.title} - {self.watched_at}"