import db from "../../../db";
import moment from 'moment';

export default async function handler(req, res) {
  const { 
    pass_port_address,
    receive_address,
    receive_amount
  } = req.body;

  if (pass_port_address === undefined || pass_port_address === "") {
    res
      .status(400)
      .json({ successful: false, error: "pass_port_address cannot be empty" });
    return;
  }
  if (receive_address === undefined || receive_address === "") {
    res
      .status(400)
      .json({ successful: false, error: "receive_address cannot be empty" });
    return;
  }
  if (receive_amount === undefined || receive_amount === "") {
    res
      .status(400)
      .json({ successful: false, error: "receive_amount cannot be empty" });
    return;
  }

  //todo check limit


  // const rows = await db("faucet")
  //   .insert({ 
  //     pass_port_address: pass_port_address, 
  //     receive_address: receive_address,
  //     receive_time: receive_time,
  //     receive_amount: receive_amount,
  //   })
  //   .returning("*");

  // res.status(200).json({
  //   successful: true,
  //   added: { id: rows[0].id, 
  //     pass_port_address: pass_port_address, 
  //     receive_address: receive_address,
  //     receive_time: receive_time,
  //     receive_amount: receive_amount, },
  // });

  let today_0_hour = new Date(); // take the current time
  today_0_hour.setHours(0);
  today_0_hour.setMinutes(0);
  today_0_hour.setSeconds(0);

  let tomorrow_0_hour = new Date(today_0_hour)
  tomorrow_0_hour.setDate(today_0_hour.getDate() + 1)

  let startDate = moment(today_0_hour).format('YYYY-MM-DDTHH:mm:ssZ');
  let endDate = moment(tomorrow_0_hour).format('YYYY-MM-DDTHH:mm:ssZ');

  console.log("@@@ datatime: ", today_0_hour, tomorrow_0_hour);

  let limit = 100;
  var sum_faucet_infos_by_pass_port_address = await db("faucet").whereBetween('receive_time', [startDate, endDate]).andWhere({ pass_port_address: pass_port_address }).sum('receive_amount');
  console.log("@@@sum_faucet_infos_by_pass_port_address", sum_faucet_infos_by_pass_port_address, sum_faucet_infos_by_pass_port_address + receive_amount, sum_faucet_infos_by_pass_port_address[0]['sum(`receive_amount`)']);
  if (sum_faucet_infos_by_pass_port_address[0]['sum(`receive_amount`)'] + receive_amount > limit) {
    res
    .status(400)
    .json({ success: false, message: limit + " reach limit per gitcoin pass_port address " });
    
    return;
  }

  var sum_faucet_infos_by_receive_address = await db("faucet").whereBetween('receive_time', [startDate, endDate]).andWhere({ receive_address: receive_address }).sum('receive_amount');
  console.log("@@@sum_faucet_infos_by_receive_address", sum_faucet_infos_by_receive_address, sum_faucet_infos_by_receive_address + receive_amount, sum_faucet_infos_by_receive_address[0]['sum(`receive_amount`)']);
  if (sum_faucet_infos_by_receive_address[0]['sum(`receive_amount`)'] + receive_amount > limit) {
    res
    .status(400)
    .json({ success: false, message: limit + "reach limit per receive address" });
    
    return;
  }

  res.status(200).json({
    success: true,
    message: "allow to get token, pass limit check",
    data: null,
  });
}
