import { Schema, model, Document } from 'mongoose';
// import { v4 } from 'uuid';
import 'dotenv/config';

export interface ISiswa {
    data: {
        username: String;
        kelas: String;
        poin: [
            {
                aspek: String;
                poin: Number;
            }
        ];
        amount: Number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ISiswaModel extends ISiswa, Document {}

const SiswaSchema: Schema = new Schema(
    {
        // _id: {
        //     type: String,
        //     default: function () {
        //         return v4();
        //     }
        // },
        data: {
            username: {
                type: String,
                required: true,
                min: 6,
                max: 12
            },
            kelas: {
                type: String,
                enum: ['TI.21.A.1', 'TI.21.A.2', 'TI.21.A.3'],
                required: true
            },
            violation: [
                {
                    aspek: {
                        type: String,
                        required: true
                    },
                    poin: {
                        type: Number,
                        required: true
                    },
                    deskripsi: {
                        type: String,
                        required: true
                    }
                }
            ],
            amount: {
                type: Number,
                required: true
            }
        }
    },
    { timestamps: true, versionKey: false }
);

export default model<ISiswaModel>('Siswa', SiswaSchema);
