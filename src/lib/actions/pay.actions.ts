import axios from "axios";
import { toDBDate } from "../utils";
import { updateInvoice } from "~/utils/indexeddb";

export async function submit_direct_sale_request(
  //receipt_info: CompanyReceiptInfo,
  site_url: string,
  company_prefix: string,
  user_id: string,
  username: string,
  data_items: DirectSales[],
  customer: Customer,
  payments: PaymentCart[],
  customer_name: string,
  uid: string,
  pin: string,
) {
  console.log("Submitting payment details for direct sale");

  const total = data_items.reduce(
    (x, y) => x + y.details.price * y.quantity,
    0,
  );
  console.log("total", total);

  if (data_items) {
    data_items.map((x) => {
      if (x.quantity > x.max_quantity) {
        return null;
      }
    });
  }
  console.log("data_items", data_items);
  const items = data_items.map((x: DirectSales) => {
    const tax = (parseInt(x.item.rate) * x.details.price) / 100;
    const item_total = x.details.price * x.quantity;

    return {
      quantity: x.quantity.toFixed(2),
      quantityAval: x.details.quantity_available.toFixed(2),
      booking_id: "",
      customer_option: customer.br_name,
      // new user will not have branch code
      customer_option_id: customer.branch_code,
      booking_type: "",
      discount: x.discount ?? "0",
      mode_prices: "1",
      kit: x.item.kit,
      batch_no: "",
      // tax is not applicable for direct sale
      tax: tax.toFixed(2),
      item_option: x.item.description,
      item_option_id: x.item.stock_id,
      rate: x.item.rate,
      deposit: "",
      total: item_total.toFixed(2),
      price: x.details.price.toFixed(2),
      posBatchSelect: "",
      bottles_issued: x.bottles_issued ?? "",
      bottles_returned: x.bottles_returned ?? "",
      fsalesp: "",
    };
  });

  const payment = payments.flatMap((x) =>
    x.payments.map((y) => ({
      ...y,
      Transtype: x.paymentType,
    })),
  );

  console.log("payment", payment);
  console.log("items", items);

  const form_data = new FormData();
  form_data.append("tp", "booking-cash-payment");
  form_data.append("cp", company_prefix);
  form_data.append("id", user_id);
  form_data.append("ttp", payments[0]!.paymentType!);
  form_data.append("total", total.toString());
  form_data.append("pospayments", JSON.stringify(payment));
  form_data.append("posdesc", JSON.stringify(items));
  form_data.append("uname", username);
  form_data.append("cpbooking_id", "");
  form_data.append("cust_name", customer_name);
  form_data.append("unique_identifier", uid);
  form_data.append("cust_pin", pin);

  try {
    if (navigator.onLine) {
      const response = await axios.postForm<
        SalesReceiptInformation | OfflineSalesReceiptInformation
      >(`${site_url}process.php`, form_data);
      console.log("Submission successful");
      console.log("SALES RESPONSE", response.data);

      if (typeof response.data === "string") {
        // SEND STRING TO SENTRY
        return null;
      }
      return response.data;
    }
    // else {
    //   console.log("Offline: Saving data to IndexedDB");
    else {
      return {
        offline: true,
        uid,
        customer: customer,
        uname: username,
        id: user_id,
        pin: pin,
        inv_date: new Date().toISOString(),
        pos_payments: JSON.stringify(payment),
        pos_items: JSON.stringify(items),
        total: total.toString(),
        synced: false,
        synced_at: "",
      };
    }
  } catch (e) {
    console.error(e);
    // TODO: SHOULD WE SAVE TO INDEXEDDB?
    if (axios.isAxiosError(e)) {
      console.error(e);
      return {
        offline: true,
        uid,
        inv_date: new Date().toISOString(),
        pos_payments: JSON.stringify(payment),
        pos_items: JSON.stringify(items),
        synced: false,
        synced_at: "",
      };
    } else {
      console.error("Failed to submit direct sale data");
      return null;
    }
  }
}

export async function sync_invoice(
  site_url: string,
  company_prefix: string,
  invoice: UnsynchedInvoice,
) {
  const payments: PaymentCart[] = JSON.parse(invoice.pos_payments);
  const trans_date = toDBDate(invoice.inv_date);
  const form_data = new FormData();
  form_data.append("tp", "booking-cash-payment");
  form_data.append("cp", company_prefix);
  form_data.append("id", invoice.id);
  form_data.append("ttp", payments[0]!.paymentType!);
  form_data.append("total", invoice.total);
  form_data.append("pospayments", invoice.pos_payments);
  form_data.append("posdesc", invoice.pos_items);
  form_data.append("uname", invoice.uname);
  form_data.append("cpbooking_id", "");
  form_data.append("cust_name", invoice.customer.br_name);
  form_data.append("unique_identifier", invoice.uid);
  form_data.append("cust_pin", invoice.pin);
  form_data.append("offline", "1");
  form_data.append("trans_date", trans_date);

  try {
    const response = await axios.postForm<SalesReceiptInformation>(
      `${site_url}process.php`,
      form_data,
    );
    console.log("response", response);
    if (typeof response.data === "string") {
      // SEND STRING TO SENTRY
      return null;
    }
    if (response.data.message === "Success") {
      invoice.synced = true;
      invoice.synced_at = new Date().toISOString();
      invoice.offline = false;

      await updateInvoice(invoice.uid, invoice);
    }
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetch_customers(
  site_url: string,
  company_prefix: string,
) {
  const form_data = new FormData();
  form_data.append("tp", "loadCustomersBranches");
  form_data.append("cp", company_prefix);
  form_data.append("name", "%%");

  try {
    const response = await axios.postForm<Customer[]>(
      `${site_url}process.php`,
      form_data,
    );

    if (typeof response.data === "string" && (response.data as string) === "") {
      return null;
    }

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e);
    }
    return null;
  }
}

export async function fetch_mpesa_transactions(
  site_url: string,
  company_prefix: string,
  user_id: string,
) {
  const form = new FormData();
  form.append("tp", "loadMpesaTransaction");
  form.append("cp", company_prefix);
  form.append("id", user_id);

  try {
    const response = await axios.postForm<Payment[]>(
      `${site_url}process.php`,
      form,
    );

    console.log("MPESA ", response.data);

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log("Failed to load mpesa transactions");
    }
    console.log(e);
  }

  return null;
}

export async function fetch_manual_bank_payment_accounts(
  site_url: string,
  company_prefix: string,
) {
  const form = new FormData();
  form.append("tp", "getManualBanks");
  form.append("cp", company_prefix);

  try {
    const response = await axios.postForm<ManualBankPaymentAccount[]>(
      `${site_url}process.php`,
      form,
    );

    if (typeof response.data === "string") {
      console.log("Payment accounts not loaded");
      return null;
    }
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
