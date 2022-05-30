import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import sendgrid from '@sendgrid/mail';
import { EmailProviderInterface } from '../../common/interfaces/email-provider.interface'
import {environment} from '../../../environments/environment';

@injectable()
export class EmailProvider implements EmailProviderInterface {
    templates: any;
    private readonly EMAIL_FROM_NAME = 'Fhynix Team'
    private readonly EMAIL_FROM_EMAIL = 'team@fhynix.com'
    constructor() {
        this.templates = {
            WelcomeEmail:'d-2cdd275e0be743889758a196b7ed334e'
        };
    }

    async sendEmailUsingTemplate(   
        templateId: string,
        tos: string[],
        subject:string,
        substitutions: Object = {},
        ccs?: string[],
        attachments: any[] = []
    ){
        sendgrid.setApiKey(environment.sendgridApiKey);

        const email: any = {
            from: { name: this.EMAIL_FROM_NAME, email: this.EMAIL_FROM_EMAIL },
            to: tos,
            templateId,
            cc: ccs?.filter((cc: any) => !tos.some((to: any) => cc.email === to.email)),
        };

        email.dynamic_template_data = substitutions;
        email.dynamic_template_data.subject = subject;

        email.attachments = [];
        if (attachments.length) {
            attachments.forEach(attachment => {
                email.attachments.push({
                    content: Buffer.from(attachment.data).toString('base64'),
                    filename: attachment.fileName,
                    type: 'plain/text',
                    disposition: 'attachment'
                });
            });
        }

        try {
            const response = await sendgrid.send(email);
        } catch (error) {}
    }
}