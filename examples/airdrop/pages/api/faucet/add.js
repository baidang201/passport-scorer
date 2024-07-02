import db from "../../../db";

export default async function handler(req, res) {
  const { 
    pass_port_address,
    receive_address,
    receive_time,
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
  if (receive_time === undefined || receive_time === "") {
    res
      .status(400)
      .json({ successful: false, error: "receive_time cannot be empty" });
    return;
  }
  if (receive_amount === undefined || receive_amount === "") {
    res
      .status(400)
      .json({ successful: false, error: "receive_amount cannot be empty" });
    return;
  }

  const rows = await db("faucet")
    .insert({ 
      pass_port_address: pass_port_address, 
      receive_address: receive_address,
      receive_time: receive_time,
      receive_amount: receive_amount,
    })
    .returning("*");

  res.status(200).json({
    successful: true,
    added: { id: rows[0].id, 
      pass_port_address: pass_port_address, 
      receive_address: receive_address,
      receive_time: receive_time,
      receive_amount: receive_amount, },
  });
}
