const generateUniqueIdCustom = () => {
    const timestamp = Date.now().toString(16);
    const randomPart = Math.floor(Math.random() * 1000000)
      .toString(16)
      .padStart(6, "0");
    return (timestamp + randomPart);
  };

export default generateUniqueIdCustom;