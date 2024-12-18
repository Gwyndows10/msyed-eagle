export const getTookFoodStats = async () => {
    return Recipient.aggregate([
      {
        $group: {
          _id: "$tookFood",
          count: { $sum: 1 },
        },
      },
    ]);
  };
  
  export const getGenderStats = async () => {
    return Recipient.aggregate([
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);
  };
  

  