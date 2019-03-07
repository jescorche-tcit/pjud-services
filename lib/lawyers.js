import request from 'request-promise'
import cheerio from 'cheerio'

export default class LawyerServices {
  static validate(taxNumber, callback, next) {
    const uri = 'http://www.pjud.cl/busqueda-de-abogados'
    console.log(`Validating that exists a lawyer with tax number: ${taxNumber}`);
    const mainPageOptions = {
      method: 'GET',
      uri,
      resolveWithFullResponse: true
    };

    request(mainPageOptions)
      .then((response) => {
        const html = response.body;
        let $ = cheerio.load(html);
        const formUrl = $('#_busquedaabogado_WAR_busquedaabogadosTESTportlet_form1').attr('action');
        console.log('Form url:', formUrl);
        const now = new Date();
        const cookies = response.headers['set-cookie'];
        // ToDo: It assumes that token cookie is the first one. It should be looked for before
        const cookieJar = request.jar();
        cookieJar.setCookie(cookies[0], formUrl);

        const formOptions = {
          method: 'POST',
          uri: formUrl,
          form: {
            '_busquedaabogado_WAR_busquedaabogadosTESTportlet_formDate' : now.getTime(),
            '_busquedaabogado_WAR_busquedaabogadosTESTportlet_campoRut' : taxNumber.substr(0, taxNumber.length - 1),
            '_busquedaabogado_WAR_busquedaabogadosTESTportlet_campoRutLetra' : taxNumber[taxNumber.length - 1],
            '_busquedaabogado_WAR_busquedaabogadosTESTportlet_campoNombre' : '',
            '_busquedaabogado_WAR_busquedaabogadosTESTportlet_campoPaterno' : '',
            '_busquedaabogado_WAR_busquedaabogadosTESTportlet_campoMaterno' : ''
          },
          jar: cookieJar,
          resolveWithFullResponse: true
        };

        request(formOptions)
          .then((formResponse) => {
            const resultHtml = formResponse.body;
            $ = cheerio.load(resultHtml);
            const searchResults = $('td[headers=_busquedaabogado_WAR_busquedaabogadosTESTportlet_ocerSearchContainer_col-nombre]');
            const isValid = searchResults.length > 0;
            console.log(`Is it a valid lawyer? ${isValid}\n\n`);
            callback({ result: isValid });
          })
          .catch((error) => {
            console.log('Error while trying to validate lawyer');
            console.log(error);
            next(error);
          })
      })
      .catch((error) => {
        console.log('Error while trying to validate lawyer');
        console.log(error);
        next(error);
      });
  }
}
