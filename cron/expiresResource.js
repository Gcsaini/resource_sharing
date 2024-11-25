import { Op } from "sequelize";
import Resource from "../models/resource.js";
export default async function expireResources() {
  const currentDate = new Date();
  await Resource.update(
    { is_expired: true },
    {
      where: {
        expiration_time: { [Op.lt]: currentDate },
        is_expired: false,
      },
    }
  );
}
