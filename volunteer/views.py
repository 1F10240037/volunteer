from django.shortcuts import render

# Create your views here.
def top(request):
    return render(request, 'volunteer/top.html')

def organization_list(request):
    return render(request, 'volunteer/organization_list.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')