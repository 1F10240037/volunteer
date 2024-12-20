from django.urls import path
from . import views

urlpatterns = [
	path('', views.top, name='top'),
	path('organization', views.organization_list, name='organization_list'),
]