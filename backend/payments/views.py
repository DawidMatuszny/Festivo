import stripe
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from rest_framework.views import APIView
from django.conf import settings
from events.views import Event
from userapi.views import CustomUser
from django.shortcuts import get_object_or_404
from events.models import EventRegistration

stripe.api_key = settings.STRIPE_SECRET_KEY

class create_checkout_session(APIView):
    def post(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        user = request.user

        if EventRegistration.objects.filter(user=user, event=event).exists():
            return Response({"error": "Jesteś już zapisany na to wydarzenie."}, status=status.HTTP_400_BAD_REQUEST)

        if event.available_spots <= 0:
            return Response({"error": "Brak dostępnych miejsc na to wydarzenie."}, status=status.HTTP_400_BAD_REQUEST)

        try:

            event.available_spots -= 1
            event.save()

            temp_registration = EventRegistration.objects.create(user=user, event=event, is_temporary=True)

            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price_data': {
                            'currency': 'pln',
                            'product_data': {
                                'name': event.title,
                            },
                            'unit_amount': int(event.price * 100),
                        },
                        'quantity': 1,
                    },
                ],
                payment_method_types=['card', ],
                mode='payment',
                success_url=f'http://127.0.0.1:8000/payment-success/?session_id={{CHECKOUT_SESSION_ID}}&event_id={event.id}&user_id={user.id}',
                cancel_url=f'http://127.0.0.1:8000/payment-cancel/?event_id={event.id}&user_id={user.id}',
                metadata={'user_id': user.id},
            )

            return Response({'url': checkout_session.url}, status=status.HTTP_200_OK)
        except Exception as e:

            event.available_spots += 1
            event.save()
            return Response({'error': f'Wystąpił błąd: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
def payment_cancel(request):
    user_id = request.GET.get('user_id')
    user = get_object_or_404(CustomUser, id=user_id)

    event_id = request.GET.get('event_id')
    event = get_object_or_404(Event, id=event_id)

    registration = EventRegistration.objects.filter(user=user, event=event, is_temporary=True).first()
    if registration:
        registration.delete()

        event.available_spots += 1
        event.save()

    return redirect('http://localhost:5173/payments-cancel/')

def payment_success(request):
    session_id = request.GET.get('session_id')
    event_id = request.GET.get('event_id')
    user_id = request.GET.get('user_id')
    if session_id:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == 'paid':
                event = get_object_or_404(Event, id=event_id)
                user = get_object_or_404(CustomUser, id=user_id)

                registration = EventRegistration.objects.filter(user=user, event=event, is_temporary=True).first()
                if registration:
                    registration.is_temporary = False
                    registration.save()

                return redirect('http://localhost:5173/payments-success/')
        except Exception as e:
            return redirect('/')

    return redirect('/')