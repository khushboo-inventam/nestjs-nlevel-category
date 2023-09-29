/* eslint-disable max-classes-per-file */
/* eslint-disable camelcase */

export class UserPaymentMethodResponseDto {
  payment_method_id: string;

  email: string;

  name: string;

  phone: string;

  card_brand: string;

  funding: string;

  last4: string;

  type: string;

  line1: string;

  line2: string;

  city: string;

  country: string;

  state: string;

  postal_code: string;
}

export class UserPaymentMethodResponse {
  message: string;

  data: UserPaymentMethodResponseDto;
}

export class GetAllUserPaymentMethodResponse {
  message: string;

  data: UserPaymentMethodResponseDto[];
}
