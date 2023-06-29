export const generateProductDeletedWarningMail = (product) => {
    return `<div style="background-color: #F7F8F3; padding-top: 20px; padding-bottom: 20px;">
    <div style="max-width: 640px; margin: 0 auto; border-radius: 4px; overflow: hidden;">
        <div style="margin: 0 auto; max-width: 640px; background-color: #ffffff; padding-bottom: 30px;">
            <div style=" display: inline-block; text-align: left; vertical-align: top; direction: ltr; padding: 40px 50px; font-family: Arial, Helvetica, sans-serif; font-size: 16px;">
                <h2 style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 20px; color: #012C3D; letter-spacing: 0.27px;">Estimado usuario:</h2>
                <p style="line-height: 24px; text-align: left;">Esperamos que te encuentres bien. Nos comunicamos para informarte que uno de nuestros administradores ha eliminado un producto que previamente habías creado en nuestro e-commerce.</p>
                <p style="line-height: 24px; text-align: left;">Se trata de ${product.name}.</p>.
                <p style="line-height: 24px; text-align: left;">Lamentamos cualquier inconveniente que esto pueda haber causado. Queremos asegurarte que tomamos esta decisión después de considerar cuidadosamente todos los aspectos pertinentes. Si tienes alguna pregunta o inquietud adicional sobre esta eliminación, no dudes en comunicarte con nuestro equipo de soporte.</p>
                <p style="line-height: 24px; text-align: left;">Valoramos tu participación en nuestra plataforma y te animamos a seguir utilizando nuestros servicios. Nuestro objetivo es proporcionar la mejor experiencia posible a nuestros usuarios, y estamos aquí para ayudarte en lo que necesites.</p>
                <p style="line-height: 24px; text-align: left;">Gracias por tu comprensión.</p>
                <p style="line-height: 24px; text-align: left;">Atentamente,</p>
                <p style="line-height: 24px; text-align: left;">Equipo de e-commerce CoderBackend</p>
            </div>
        </div>
    </div>
</div>`
};