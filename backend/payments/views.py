import stripe
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from rest_framework.views import APIView
from django.conf import settings
from events.views import Event
from django.shortcuts import get_object_or_404
import logging

stripe.api_key = settings.STRIPE_SECRET_KEY
logger = logging.getLogger(__name__)
class create_checkout_session(APIView):
    def post(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        try:
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
                payment_method_types=['card',],
                mode='payment',
                success_url='http://127.0.0.1:8000/payment-success/?session_id={CHECKOUT_SESSION_ID}&event_id={event.id}',
                cancel_url='http://localhost:5173/',
            )

            return Response({'url': checkout_session.url}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Błąd przy tworzeniu sesji płatności: {str(e)}")
            return Response(
                {'error': f'Wystąpił błąd: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
def payment_success(request):
    session_id = request.GET.get('session_id')
    if session_id:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == 'paid':

                return redirect('http://localhost:5173/thank-you/')
        except Exception as e:
            return redirect('/payment-failure/')

    return redirect('/') 