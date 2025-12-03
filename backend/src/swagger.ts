import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import type { Express } from 'express'

export function setupSwagger(app: Express) {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Style Engine API',
        version: '0.1.0',
        description: 'REST API для Style Engine - генератор градиентов, теней и анимаций. Поддерживает аутентификацию, профили пользователей и сохранение настроек.',
        contact: {
          name: 'Dmitriy Hulak',
          url: 'https://github.com/dmitriy-hulak'
        }
      },
      servers: [
        {
          url: 'http://localhost:4000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Введите JWT токен, полученный при регистрации или авторизации'
          }
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Описание ошибки'
              },
              issues: {
                type: 'array',
                description: 'Детали валидации (если есть)',
                items: {
                  type: 'object'
                }
              }
            }
          },
          User: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Уникальный идентификатор пользователя'
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Email пользователя'
              },
              name: {
                type: 'string',
                nullable: true,
                description: 'Имя пользователя'
              },
              avatarUrl: {
                type: 'string',
                format: 'uri',
                nullable: true,
                description: 'URL аватара пользователя'
              },
              isPayment: {
                type: 'boolean',
                description: 'Есть ли оплаченный доступ'
              },
              subscriptionTier: {
                type: 'string',
                enum: ['free', 'pro', 'premium'],
                description: 'Текущий тариф пользователя'
              },
              subscriptionExpiresAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                description: 'Дата окончания платной подписки (null для free, 2100-01-01 для бессрочной)'
              },
              isAdmin: {
                type: 'boolean',
                description: 'Является ли пользователь администратором'
              },
              isSuperAdmin: {
                type: 'boolean',
                description: 'Отметка супер-админа (email из env)'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Дата создания аккаунта'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Дата последнего обновления'
              }
            }
          },
          SavedItem: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Уникальный идентификатор сохраненного элемента'
              },
              name: {
                type: 'string',
                description: 'Название сохраненного элемента'
              },
              payload: {
                type: 'object',
                description: 'JSON данные с настройками градиента/тени/анимации'
              },
              status: {
                type: 'string',
                enum: ['private', 'pending', 'approved'],
                description: 'Статус публикации'
              },
              isFeatured: {
                type: 'boolean',
                description: 'Выделенная работа (показывается первой)'
              },
              approvedAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                description: 'Дата утверждения модератором'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Дата сохранения'
              }
            }
          },
          QuizQuestion: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              questionText: { type: 'string' },
              codeSnippet: { type: 'string', nullable: true },
              answers: { type: 'array', items: { type: 'string' } },
              category: { type: 'string', enum: ['css', 'scss', 'stylus'] },
              difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          },
          QuizQuestionAdmin: {
            allOf: [
              { $ref: '#/components/schemas/QuizQuestion' },
              {
                type: 'object',
                properties: {
                  correctAnswerIndex: { type: 'integer' },
                  explanation: { type: 'string', nullable: true }
                }
              }
            ]
          },
          QuizSettings: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              questionsPerTest: { type: 'integer', minimum: 5, maximum: 100 },
              timePerQuestion: { type: 'integer', minimum: 10, maximum: 300 }
            }
          },
          QuizResult: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid', nullable: true },
              username: { type: 'string' },
              category: { type: 'string', enum: ['css', 'scss', 'stylus', 'mix'] },
              score: { type: 'integer' },
              totalQuestions: { type: 'integer' },
              timeTaken: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      },
      tags: [
        {
          name: 'Auth',
          description: 'Регистрация и авторизация'
        },
        {
          name: 'Profile',
          description: 'Управление профилем пользователя'
        },
        {
          name: 'Saves',
          description: 'Сохраненные градиенты, тени и анимации'
        },
        {
          name: 'Moderation',
          description: 'Модерация пользовательских работ'
        },
        {
          name: 'Health',
          description: 'Проверка состояния API'
        },
        {
          name: 'Quiz',
          description: 'CSS/SCSS/Stylus тесты'
        }
      ]
    },
    apis: ['./src/routes/*.ts']
  }

  const swaggerSpec = swaggerJsdoc(options)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
