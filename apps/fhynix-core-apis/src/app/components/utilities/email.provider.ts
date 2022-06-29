import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import sendgrid from '@sendgrid/mail'
import { EmailProviderInterface } from '../../common/interfaces/email-provider.interface'
import { environment } from '../../../environments/environment'
import { ThirdPartyAPIError } from '../../common/errors/custom-errors/third-party.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'

@injectable()
export class EmailProvider implements EmailProviderInterface {
  templates: any
  private readonly EMAIL_FROM_NAME = 'Fhynix Team'
  private readonly EMAIL_FROM_EMAIL = 'team@fhynix.com'
  constructor() {
    this.templates = {
      WelcomeEmail: 'd-2cdd275e0be743889758a196b7ed334e',
      eventTemplateId: 'd-8b07c37aafcb4b86a4eac881e05ddac1',
    }
  }

  async sendEmailUsingTemplate(
    templateId: string,
    tos: string[],
    subject: string,
    substitutions: Record<string, string> = {},
    ccs?: string[],
    attachments: any[] = [],
  ) {
    sendgrid.setApiKey(environment.sendgridApiKey)

    const email: any = {
      from: { name: this.EMAIL_FROM_NAME, email: this.EMAIL_FROM_EMAIL },
      to: tos,
      templateId,
      cc: ccs?.filter(
        (cc: any) => !tos.some((to: any) => cc.email === to.email),
      ),
    }

    email.dynamic_template_data = substitutions
    email.dynamic_template_data.subject = subject

    email.attachments = []
    if (attachments.length) {
      attachments.forEach((attachment) => {
        email.attachments.push({
          content: Buffer.from(attachment.data).toString('base64'),
          filename: attachment.fileName,
          type: 'plain/text',
          disposition: 'attachment',
        })
      })
    }

    try {
      const response = await sendgrid.send(email)
      return response
    } catch (error) {
      throw new ThirdPartyAPIError(ApiErrorCode.E0101)
    }
  }
}
