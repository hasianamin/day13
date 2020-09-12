export const priceFormatter = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num);
};
export const API_URL='http://localhost:4000'