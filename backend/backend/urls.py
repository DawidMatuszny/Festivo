from django.contrib import admin
from django.urls import path, include
from userapi.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('userapi/user/register/', CreateUserView.as_view(), name='register'),
    path('userapi/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('userapi/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('userapi-auth/', include('rest_framework.urls')),
]