async function get(request, response) {
  try {
    const dados =
      request.method == "GET" ? request.query : await request.json();
    console.log(dados);
    response.status(200).json({ success: true, request: dados });
  } catch (error) {
    console.error(error);
    response.status(200).json({ success: false, error: error });
  }
}

export default get;
