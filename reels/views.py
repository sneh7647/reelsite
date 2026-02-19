from django.shortcuts import render
from .models import Reel, Like, View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def reel_feed(request):
    reels = Reel.objects.order_by('-created_at')
    return render(request, 'reels/feed.html', {'reels': reels})


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def like_reel(request, reel_id):
    reel = Reel.objects.get(id=reel_id)
    ip = get_client_ip(request)

    existing_like = Like.objects.filter(reel=reel, ip_address=ip).first()

    if existing_like:
        return JsonResponse({
            "liked": False,
            "message": "Already liked",
            "total_likes": reel.total_likes()
        })

    Like.objects.create(reel=reel, ip_address=ip)

    return JsonResponse({
        "liked": True,
        "total_likes": reel.total_likes()
    })
    
    
    
def add_view(request, reel_id):
    reel = Reel.objects.get(id=reel_id)

    # Create new view record
    View.objects.create(reel=reel)

    return JsonResponse({"success": True})

