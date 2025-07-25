export function formatCurrency(amount: number, locale: string) {
  if (locale === 'en') {
    const usd = amount / 26000;
    return `${usd.toFixed(2).toLocaleString()} USD`;
  }

  return `${amount.toLocaleString('vi-VN')} VND`;
}
