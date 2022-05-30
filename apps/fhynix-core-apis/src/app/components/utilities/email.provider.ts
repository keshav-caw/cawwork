import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import sendgrid from '@sendgrid/mail';
import { EmailProviderInterface } from '../../common/interfaces/email-provider.interface'
import {environment} from '../../../environments/environment';

@injectable()
export class EmailProvider implements EmailProviderInterface {
    templates: any;
    constructor() {
        this.templates = {
            WelcomePage:'d-2cdd275e0be743889758a196b7ed334e'
        };
    }

    async sendEmails(   
        templateId: any,
        tos: any,
        substitutions: any = {},
        ccs?: any,
        attachments: any[] = []
    ){
        sendgrid.setApiKey(environment.sendgridApiKey);

        const email: any = {
            from: { name: 'Fhynix', email: 'tools@fhynix.com' },
            to: tos,
            templateId,
            cc: ccs?.filter((cc: any) => !tos.some((to: any) => cc.email === to.email)),
        };

        email.dynamic_template_data = substitutions;

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