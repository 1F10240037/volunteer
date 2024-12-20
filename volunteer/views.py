from django.shortcuts import render

# Create your views here.
def top(request):
    return render(request, 'volunteer/top.html')

def organization_list(request):
    return render(request, 'volunteer/organization_list.html')