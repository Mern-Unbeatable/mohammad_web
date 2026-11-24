const productImageBuilders = [
  (w, h) =>
    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=${w}${
      h ? `&h=${h}&fit=crop` : '&auto=format&fit=crop'
    }&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D`,
  (w) =>
    `https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=${w}&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D`,
  (w) =>
    `https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=${w}&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D`,
];

export const getProductImage = (index, width = 600, height) => {
  const builder = productImageBuilders[((index % 3) + 3) % 3];
  return builder(width, height);
};

export const withProductImages = (items, width = 600, height) =>
  items.map((item, index) => ({
    ...item,
    image: getProductImage(index, width, height),
  }));

export const withListingImages = (items) =>
  items.map((item, index) => ({
    ...item,
    image: getProductImage(index, 600, 400),
    images: [0, 1, 2].map((offset) => getProductImage(index + offset, 800, 500)),
  }));
