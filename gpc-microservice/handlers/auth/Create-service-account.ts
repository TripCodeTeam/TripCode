import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { CreateServiceAccountDto } from 'src/computes/dto/create-compute.dto';
import { readFile, unlink as fsUnlink } from "fs/promises"

const execAsync = promisify(exec);

export interface ServiceAccountDetails {
    message: string;
    keyFileContent: number[];
    serviceAccountEmail: string;
    usageInstructions: string;
}

export async function HandlerCreateServiceAccount(createServiceDto: CreateServiceAccountDto): Promise<ServiceAccountDetails> {
    const credentialsPath = path.resolve(__dirname, '../../credentials/atomic-energy-438322-m8-90bc56e9971a.json');
    const { accountId, displayName, projectId, roles } = createServiceDto;

    try {
        // Configurar credenciales para gcloud
        await execAsync(`gcloud auth activate-service-account --key-file="${credentialsPath}"`);

        // Crear la cuenta de servicio
        const createAccountCommand = `gcloud iam service-accounts create ${accountId} --display-name="${displayName}" --project=${projectId}`;
        await execAsync(createAccountCommand);

        // Asignar roles a la cuenta de servicio
        for (const role of roles) {
            const addRoleCommand = `gcloud projects add-iam-policy-binding ${projectId} --member="serviceAccount:${accountId}@${projectId}.iam.gserviceaccount.com" --role=${role}`;
            await execAsync(addRoleCommand);
        }

        // Generar y guardar la clave JSON
        const keyFilePath = path.resolve(__dirname, `../../keys/${accountId}-key.json`);
        const createKeyCommand = `gcloud iam service-accounts keys create "${keyFilePath}" --iam-account="${accountId}@${projectId}.iam.gserviceaccount.com"`;
        await execAsync(createKeyCommand);

        // leer el contenido del archivo generado
        const keyFileContentBuffer = await readFile(keyFilePath);
        const keyFileContentArray = Array.from(keyFileContentBuffer);

        // Borrar archivo de clave
        await fsUnlink(keyFilePath);

        // Retornar detalles para el cliente
        return {
            message: `Service account "${accountId}" created successfully in project "${projectId}".`,
            keyFileContent: keyFileContentArray,
            serviceAccountEmail: `${accountId}@${projectId}.iam.gserviceaccount.com`,
            usageInstructions: `
                To use this service account, authenticate with the following command:
                gcloud auth activate-service-account --key-file="${keyFilePath}"

                After authentication, you can deploy VMs or interact with other GCP resources using this account.
            `,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create service account: ${error.message}`);
        }
    }
}


