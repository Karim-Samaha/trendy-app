import AsyncStorage from "@react-native-async-storage/async-storage";

export const adjustNames = (text) => {
  let outPutText = "";
  if (text.length > 25) {
    outPutText = text?.substring(0, 25) + "...";
  } else {
    outPutText = text;
  }
  return outPutText;
};

export const listOf4 = (arr) => {
  var testingArr = [];
  for (let i = 0; i <= arr.length - 1; i += 4) {
    testingArr.push(arr.slice(i, i + 4));
  }
  return testingArr;
};
export const renderTotalPrice_ = (
  items,
  couponPrecent,
  pointsAmount,
  useUserPoints
) => {
  let total = 0;
  let vat = 0;
  let cards = 0;
  let extraPurchase = 0;
  let deductedAmount = 0;
  let amountToApplyVatInReceipt = 0;

  items.map((item) => {
    total += item.price * item.quantity;
    if (item.formInfo?.cardText?.length > 1) {
      cards += 6;
    }
    if (item?.selectedCard?.length) {
      for (let i = 0; i < item?.selectedCard.length; i++) {
        extraPurchase +=
          item?.selectedCard[i]?.price * item?.selectedCard[i]?.quantity;
      }
      total = total + extraPurchase
    }
  });
  let totalCheckout = total + cards + vat;
  if (couponPrecent) {
    deductedAmount = (total * couponPrecent) / 100;
    let amountToApplyVat = total - deductedAmount;
    vat = +((amountToApplyVat * 15) / 100);
    amountToApplyVatInReceipt = amountToApplyVat;
    totalCheckout = amountToApplyVatInReceipt + vat;
  } else {
    vat = +((total * 15) / 100);
    amountToApplyVatInReceipt = total;
    totalCheckout = amountToApplyVatInReceipt + vat;
  }
  if (pointsAmount && useUserPoints) {
    totalCheckout = totalCheckout - pointsAmount;
  }
  if (totalCheckout <= 0) {
    totalCheckout = 0;
  }
  return {
    total: total.toFixed(2),
    cards: cards.toFixed(2),
    giftCards: extraPurchase.toFixed(2),
    vat: vat.toFixed(2),
    fintalTotal: totalCheckout.toFixed(2),
    deductedAmount: deductedAmount.toFixed(2),
    amountToApplyVatInReceipt: amountToApplyVatInReceipt.toFixed(2),
  };
};

export function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}




export const getUser = async () => {
  const user = await AsyncStorage.getItem(("user"))
  let parsedUser;
  if (user) {
    parsedUser = JSON.parse(user)
  }
  return parsedUser;

}