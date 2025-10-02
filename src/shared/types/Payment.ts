export type Payment = {
	id: string
	created_at: string
	updated_at: string
	order_id: string
	status: string
	details: any | null
	store_id: string
	tenant_id: string
	total_amount: string
	provider: string
	payment_method: string
	provider_transaction_id: string | null
}
