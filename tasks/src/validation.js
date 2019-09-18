import Schema from 'validate'

export default function validate(fieldName, formValues, compareValue) {
  
  const equality = val => val == compareValue

  const login = new Schema({
    name: {
      required: true,
      message: {
        required: 'Nome obrigatório.'
      },
    },
    email: {
      required: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: {
        required: 'E-mail obrigatório.',
        match: 'E-mail com formato inválido.'
      },
    },
    password: {
      required: true,
      length: { min: 5, max: 10 },
      message: {
        required: 'Senha obrigatória.',
        length: 'Senha deve conter entre 5 e 10 dígitos.'
      },
    },
    confirmPassword: {
      required: true,
      use: { equality },
      message: {
        required: 'Confirmação de senha obrigatória.',
        equality: 'Confirmação deve ser igual a senha.',
      },
    },
  })

  const result = login.validate(formValues)

  if (result.length > 0) {
    var error = result.find(field => field.path===fieldName)
    return (error ? error.message : null)
  }

  return null
}