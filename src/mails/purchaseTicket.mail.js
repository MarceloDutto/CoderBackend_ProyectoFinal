export const generatePurchaseTicketEmail = (user, ticket) => {
    let ticketContent;

    ticket.products.forEach(product => {
        let name = product.item.name;
        let quantity = product.item.quantity;
        let subtotal = product.subtotal;
        let item = 
        `
        <div style=" display: flex; margin-bottom: 30px;">
            <p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.5rem; padding-right: 15px;">${name}</p>
            <p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.5rem; padding-right: 15px;">X ${quantity}</p>
            <p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.6rem; font-weight: 600; margin-left: 50px;">$ ${subtotal}</p>
        </div>
        `
        ticketContent = ticketContent + item;
    });

    return `<div style="background-color: #F7F8F3; padding-top: 20px; padding-bottom: 20px;">
    <div style="max-width: 640px; margin: 0 auto; border-radius: 4px; overflow: hidden;">
        <div style="margin: 0 auto; max-width: 640px; background-color: #ffffff; padding-bottom: 30px;">
            <div style=" display: inline-block; text-align: left; vertical-align: top; direction: ltr; padding: 40px 50px; font-family: Arial, Helvetica, sans-serif; font-size: 16px;">
                <h2 style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 20px; color: #012C3D; letter-spacing: 0.27px;">Estimado ${user.name}:</h2>
                <p style="line-height: 24px; text-align: left;">A continuación le enviamos el comprobante de su compra.</p>

                <div style= "width: 60%; margin: 0 auto; padding: 15px; display: flex; flex-direction: column; align-content: center; margin-bottom: 70px; border: 1px solid #012c3d93; border-radius: 3px; background-color: #fffffe; box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.2);">
                    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px; padding: 20px;" >
                        <h3 style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 2.3rem; font-weight: 600; letter-spacing: .5px;">CoderBackend e-commerce</h3>
                        <h4 style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.8rem; font-weight: 600;">Ticket de compra</h4>
                    </div>
                    <div style=" display: flex; flex-direction: column; align-items: flex-start;">
                        <div style="display: flex; flex-direction: column; align-items: flex-start; margin: 10px; padding: 20px;">
                            <p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.6rem; font-weight: 600;">Ticket: ${ticket.code} </p>
                            <p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.6rem; font-weight: 600;">Nombre: ${user.fullname} </p>
                            <p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.6rem; font-weight: 600;">Fecha de emisión: ${ticket.purchase_datetime} </p>
                        </div>
                        <div style="width: 100%; display: flex; flex-direction: column; align-items: flex-start; padding-inline: 100px;">${ticketContent}</div>
                    </div>
                        <div style="display: flex; width: 100%; justify-content: flex-end; margin-bottom: 50px;">
                            <h3 style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 2rem; font-weight: 900;">Total de la compra: ${ticket.amount}</h3>
                        </div>
                    </div>
            </div>
            <div class="ticket-footer">
                <h3>Gracias por su compra</h3>
                <p class="ticket-p">En breve nos comunicaremos para coordinar la entrega de su producto</p>
            </div>
                    <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 50px;">
                        <h3 style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.6rem; font-weight: 600;">Gracias por su compra</h3>
                        <p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 1.6rem; font-weight: 600;">En breve nos comunicaremos para coordinar la entrega de su producto</p>
                    </div>
                </div>

                <p style="line-height: 24px; text-align: left;">Queríamos expresar nuestro sincero agradecimiento por haber elegido nuestros productos/servicios. Valoramos enormemente tu confianza en nosotros y esperamos que tu experiencia de compra haya sido satisfactoria.</p>.
                <p style="line-height: 24px; text-align: left;">Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos. Estamos aquí para ayudarte en lo que necesites.</p>
                <p style="line-height: 24px; text-align: left;">Esperamos que disfrutes de tu nueva adquisición y que vuelvas a visitarnos pronto.</p>
                <p style="line-height: 24px; text-align: left;">¡Gracias nuevamente y que tengas un excelente día!</p>
                <p style="line-height: 24px; text-align: left;">Atentamente,</p>
                <p style="line-height: 24px; text-align: left;">Equipo de e-commerce CoderBackend</p>
            </div>
        </div>
    </div>
</div>`
};