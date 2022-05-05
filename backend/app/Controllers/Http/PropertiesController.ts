import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Propertie'
import Application from '@ioc:Adonis/Core/Application'

import { v4 as uuidv4 } from 'uuid'

export default class ImoveisController {
  private validationOptions = {               // criando um objeto para validação da imagem
    types: ['image'],
    size: '2mb',                              // tamanho máximo da imagem
  }

  
  // Rota de criação do registro
  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validationOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image!.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Moment.create(body)

    response.status(201)

    return {
      message: 'Propriedade enviada com sucesso!',
      data: moment,
    }
  }

  // Rota de resgate de todos os registros
  public async index() {
    const imoveis = await Moment.all()

    return {
      data: imoveis,
    }
  }

  //  Roda de resgate de apenas um registro especificado
  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    return {
      data: moment,
    }
  }

  // Rota de deleter um registro
  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.delete()

    return {
      message: 'Imóvel deletado com sucesso!',
      data: moment,
    }
  }

  // Rota de alteração (UPDATE) de um registro
  public async update({ params, request }: HttpContextContract) {
    const body = request.body()

    const moment = await Moment.findOrFail(params.id)

    moment.title = body.title
    moment.description = body.description

    if (moment.image != body.image || !moment.image) {              // validação pra ver se a imagem é a mesmo ou senão possui imagem
      const image = request.file('image', this.validationOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image!.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        moment.image = imageName
      }
    }

    await moment.save()

    return {
      message: 'Momento atualizado com sucesso!',
      data: moment,
    }
  }
}