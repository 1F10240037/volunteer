from django.urls import path
from . import views

urlpatterns = [
	path('', views.top, name='top'),
	path('organization', views.organization_list, name='organization_list'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('〇〇/', views.〇〇, name='〇〇'),
    
]