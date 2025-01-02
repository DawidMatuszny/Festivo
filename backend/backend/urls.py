from django.contrib import admin
from django.urls import path, include
from userapi.views import CreateUserView, LoginUserView, LoggedUserDetailView, UserEventsView, UploadProfilePictureView, ChangePasswordView
from events.views import EventCreateView, EventListView, EventDetailView, CategoriesListView, EventRegistrationCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('userapi/user/register/', CreateUserView.as_view(), name='register'),
    path('userapi/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('userapi/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('userapi/user/login/', LoginUserView.as_view(), name='login'),
    path('userapi-auth/', include('rest_framework.urls')),
    path('events/create/', EventCreateView.as_view(), name='create_event'),
    path('events/', EventListView.as_view(), name='event_list'),
    path('event/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('event/categories/', CategoriesListView.as_view(), name='category_list'),
    path('userapi/profile/', LoggedUserDetailView.as_view(), name='profile'),
    path('event/register/', EventRegistrationCreateView.as_view(), name='register_for_event' ),
    path('userapi/events/', UserEventsView.as_view(), name='user-events'),
    path('userapi/upload-profile-picture/', UploadProfilePictureView.as_view(), name='upload-picture'),
    path('userapi/change-password/', ChangePasswordView.as_view(), name='change-password'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)