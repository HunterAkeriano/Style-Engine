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
              role: {
                type: 'string',
                enum: ['user', 'moderator', 'super_admin'],
                description: 'Роль пользователя'
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
          },
          ForumAttachment: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['image', 'youtube'] },
              url: { type: 'string', format: 'uri' }
            }
          },
          ForumUser: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string', nullable: true },
              email: { type: 'string', format: 'email', nullable: true },
              avatarUrl: { type: 'string', format: 'uri', nullable: true },
              role: { type: 'string', enum: ['user', 'moderator', 'super_admin'] },
              subscriptionTier: { type: 'string', enum: ['free', 'pro', 'premium'] }
            }
          },
          ForumTopic: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              title: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string', enum: ['open', 'in_review', 'closed'] },
              attachments: { type: 'array', items: { $ref: '#/components/schemas/ForumAttachment' } },
              messagesCount: { type: 'integer' },
              lastActivityAt: { type: 'string', format: 'date-time' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              isPinned: { type: 'boolean' },
              pinnedAt: { type: 'string', format: 'date-time', nullable: true },
              pinnedBy: { type: 'string', format: 'uuid', nullable: true },
              owner: { $ref: '#/components/schemas/ForumUser' }
            }
          },
          ForumMessage: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              topicId: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              parentId: { type: 'string', format: 'uuid', nullable: true },
              content: { type: 'string' },
              attachments: { type: 'array', items: { $ref: '#/components/schemas/ForumAttachment' } },
              editedAt: { type: 'string', format: 'date-time', nullable: true },
              editedBy: { type: 'string', format: 'uuid', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              author: { $ref: '#/components/schemas/ForumUser' }
            }
          },
          ForumPagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' },
              hasMore: { type: 'boolean' }
            }
          },
          ForumListResponse: {
            type: 'object',
            properties: {
              topics: { type: 'array', items: { $ref: '#/components/schemas/ForumTopic' } },
              pagination: { $ref: '#/components/schemas/ForumPagination' }
            }
          },
          ForumTopicResponse: {
            type: 'object',
            properties: {
              topic: { $ref: '#/components/schemas/ForumTopic' },
              messages: { type: 'array', items: { $ref: '#/components/schemas/ForumMessage' } }
            }
          },
          ForumMute: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              expiresAt: { type: 'string', format: 'date-time', nullable: true },
              reason: { type: 'string', nullable: true },
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
        },
        {
          name: 'Forum',
          description: 'Форум: темы, сообщения, закрепы и мьюты'
        }
      ],
      paths: {
        '/api/forum/topics': {
          get: {
            tags: ['Forum'],
            summary: 'Список тем форума',
            parameters: [
              { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
              { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
              { name: 'status', in: 'query', schema: { type: 'string', enum: ['open', 'in_review', 'closed'] } }
            ],
            responses: {
              200: {
                description: 'Темы с пагинацией',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ForumListResponse' }
                  }
                }
              }
            }
          },
          post: {
            tags: ['Forum'],
            summary: 'Создать тему',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['title', 'description'],
                    properties: {
                      title: { type: 'string', minLength: 3, maxLength: 200 },
                      description: { type: 'string', minLength: 10, maxLength: 5000 },
                      attachments: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ForumAttachment' }
                      }
                    }
                  }
                }
              }
            },
            responses: {
              201: {
                description: 'Тема создана',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ForumTopicResponse' } } }
              }
            }
          }
        },
        '/api/forum/topics/pinned': {
          get: {
            tags: ['Forum'],
            summary: 'Закреплённые темы',
            parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 5, maximum: 20 } }],
            responses: {
              200: { description: 'Список закреплённых тем', content: { 'application/json': { schema: { type: 'object', properties: { topics: { type: 'array', items: { $ref: '#/components/schemas/ForumTopic' } } } } } } }
            }
          }
        },
        '/api/forum/topics/{id}': {
          get: {
            tags: ['Forum'],
            summary: 'Получить тему и сообщения',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            responses: {
              200: { description: 'Тема', content: { 'application/json': { schema: { $ref: '#/components/schemas/ForumTopicResponse' } } } }
            }
          },
          patch: {
            tags: ['Forum'],
            summary: 'Обновить тему',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      attachments: { type: 'array', items: { $ref: '#/components/schemas/ForumAttachment' } }
                    }
                  }
                }
              }
            },
            responses: {
              200: { description: 'Обновлённая тема', content: { 'application/json': { schema: { $ref: '#/components/schemas/ForumTopicResponse' } } } }
            }
          }
        },
        '/api/forum/topics/{id}/status': {
          patch: {
            tags: ['Forum'],
            summary: 'Сменить статус темы',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['open', 'in_review', 'closed'] } } }
                }
              }
            },
            responses: { 200: { description: 'Статус обновлён' } }
          }
        },
        '/api/forum/topics/{id}/pin': {
          post: {
            tags: ['Forum'],
            summary: 'Закрепить тему',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            responses: { 200: { description: 'Тема закреплена' } }
          },
          delete: {
            tags: ['Forum'],
            summary: 'Открепить тему',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            responses: { 200: { description: 'Тема откреплена' } }
          }
        },
        '/api/forum/topics/{id}/messages': {
          post: {
            tags: ['Forum'],
            summary: 'Добавить сообщение или ответ',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['content'],
                    properties: {
                      content: { type: 'string', minLength: 1, maxLength: 4000 },
                      parentId: { type: 'string', format: 'uuid', nullable: true },
                      attachments: { type: 'array', items: { $ref: '#/components/schemas/ForumAttachment' } }
                    }
                  }
                }
              }
            },
            responses: {
              201: { description: 'Сообщение добавлено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ForumTopicResponse' } } } }
            }
          }
        },
        '/api/forum/topics/{id}/messages/{messageId}': {
          patch: {
            tags: ['Forum'],
            summary: 'Редактировать сообщение',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
              { name: 'messageId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': { schema: { type: 'object', required: ['content'], properties: { content: { type: 'string' } } } }
              }
            },
            responses: { 200: { description: 'Сообщение обновлено' } }
          }
        },
        '/api/forum/topics/{id}/messages/{userId}': {
          delete: {
            tags: ['Forum'],
            summary: 'Удалить все сообщения пользователя в теме',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
              { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
            ],
            responses: { 200: { description: 'Сообщения удалены' } }
          }
        },
        '/api/forum/attachments': {
          post: {
            tags: ['Forum'],
            summary: 'Загрузить вложение',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'topicId', in: 'query', required: false, schema: { type: 'string', format: 'uuid' } }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      file: { type: 'string', format: 'binary' }
                    }
                  }
                }
              }
            },
            responses: {
              201: {
                description: 'URL загруженного файла',
                content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string', format: 'uri' } } } } }
              }
            }
          }
        },
        '/api/forum/mute/{userId}': {
          post: {
            tags: ['Forum'],
            summary: 'Выдать мут пользователю',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      durationMinutes: { type: 'integer', nullable: true },
                      reason: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: { 200: { description: 'Мут применён' } }
          }
        },
        '/api/forum/topics/{id}/participants': {
          get: {
            tags: ['Forum'],
            summary: 'Участники темы',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
            responses: {
              200: {
                description: 'Список участников',
                content: { 'application/json': { schema: { type: 'object', properties: { participants: { type: 'array', items: { $ref: '#/components/schemas/ForumUser' } } } } } }
              }
            }
          }
        },
        '/api/forum/my-topics/open': {
          get: {
            tags: ['Forum'],
            summary: 'Открытые темы текущего пользователя',
            security: [{ bearerAuth: [] }],
            responses: {
              200: {
                description: 'Темы пользователя',
                content: { 'application/json': { schema: { type: 'object', properties: { topics: { type: 'array', items: { $ref: '#/components/schemas/ForumTopic' } } } } } }
              }
            }
          }
        },
        '/api/forum/my-mutes': {
          get: {
            tags: ['Forum'],
            summary: 'Активные мюты текущего пользователя',
            security: [{ bearerAuth: [] }],
            responses: {
              200: { description: 'Список мьютов', content: { 'application/json': { schema: { type: 'object', properties: { mutes: { type: 'array', items: { $ref: '#/components/schemas/ForumMute' } } } } } } }
            }
          }
        },
        '/api/forum/mute-status': {
          get: {
            tags: ['Forum'],
            summary: 'Проверить статус мута текущего пользователя',
            security: [{ bearerAuth: [] }],
            responses: { 200: { description: 'Статус мута', content: { 'application/json': { schema: { type: 'object' } } } } }
          }
        }
      }
    },
    apis: ['./dist/routes/*.js', './src/interfaces/http/controllers/*.ts']
  }

  const swaggerSpec = swaggerJsdoc(options)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
