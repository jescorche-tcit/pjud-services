import request from 'request-promise'
import cheerio from 'cheerio'

export default class LawyerServices {
  static validate(taxNumber, callback) {
    const url = 'http://www.pjud.cl/busqueda-de-abogados'
    console.log(`Validating that exists a lawyer with tax number: ${taxNumber}`);

    request(url)
      .then((html) => {
        console.log('Received response');
        console.log(html);
        const $ = cheerio.load(html);
        const formUrl = $('#_busquedaabogado_WAR_busquedaabogadosTESTportlet_form1').attr('action');
        console.log('form url:', formUrl);
        callback(html);
      })
      .catch((error) => {
        console.log('Error while trying to validate lawyer');
        console.log(error);
      });
  }
}
