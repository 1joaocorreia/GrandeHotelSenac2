import { getClientById } from "../api/clientAPI.js";

function generateStars(amount) {
	amount = parseInt(amount);
	
	const single_star = "⭐";
	
	var stars = "";
	for (let c = 0; c < amount; c++) {
		stars += single_star;
	}

	return stars;
}

async function generateHtmlForReviews(reviewData) {
	let html = "";
	if (reviewData == null || reviewData.length == 0) {
		return `<p style="color: darkred;">Nenhuma avaliação encontrada</p>`;
	}
	
	for(let c = 0; c < reviewData.length; c++) {
		const review = reviewData[c];
		const client = await getClientById(review["client_author"]);
		if (client.ok && client.raw != null) {
			html += `
				<div class="single_review">
					<div class="review_header">
						<div class="review_header_left">
							<p class="review_p""><b>${client.raw.nome}</b></p>
							<p>${generateStars(review.stars)}</p>
						</div>
						<p class="review_p" style="text-align: right;">${review.data}</p>
					</div>
					<div class="review_body">
						<p>${review.conteudo}</p>
					</div>
				</div>
			`;
		}
	}
	return html;
}

export async function RoomPage(roomData, reviewData) {
	const reviewsHtml = await generateHtmlForReviews(reviewData);

	const html = `
		<div class="main">
			<div class="horizontal" style="align-items: baseline; justify-content: space-between; padding: 1rem;">
				<h1 class="title">${roomData['nome']}</h1>
				<p>n${roomData['numero']}</p>
			</div>
			<div class="field">
				<h1 class="title">Características</h1>
				<p class="italic">Este quarto posssui <b>${roomData['qnt_cama_casal']} camas de casal</b></p>
				<p class="italic">Este quarto possui <b>${roomData['qnt_cama_solteiro']} camas de solteiro</b></p>
				<p class="italic">O valor de uma noite neste quarto é de <b>R$ ${roomData['preco']}</b></p>
				<p class="italic">Este quarto <b>${(roomData['disponivel'] == 0) ? "não está" : "está"} disponível</b></p>
			</div>
			<div class="field">
				<h1 class="title">Avaliações</h1>
				${reviewsHtml}
			</div>
			<div class="horizontal buttons_field">
				<a class="button" style="max-width: 100%; width: 100%; text-align: center;" id="btn-reservar">RESERVAR</a>			</div>
		</div>
	`;
		
	return html;
}
