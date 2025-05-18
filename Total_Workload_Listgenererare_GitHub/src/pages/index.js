
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function TotalWorkloadListgenererare() {
    const [file, setFile] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false);

    const categories = [
        "MANUELL AVD. & ORDERBEREDNING",
        "RUNDSLIPNING",
        "NC-AVD.",
        "ROBOTPLANERING",
        "BELÄGGNINGSAVDELNING",
        "LEVERANS & LOGISTIK"
    ];

    const globalFilter = (jsonData) => {
        return jsonData.filter(row => row['Direct Position'] === 'Y')
                        .filter(row => !['303270569', '303292808'].includes(row['Article No.']))
                        .map(row => ({
                            ...row,
                            'Customer': row['Customer'] ? row['Customer'].toUpperCase() : 'GULA SKÅPET'
                        }));
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setIsFileSelected(true);
        }
    };

    const handleGenerateList = (category) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let jsonData = XLSX.utils.sheet_to_json(worksheet);

            jsonData = globalFilter(jsonData);
            console.log(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="flex flex-col items-center p-8 bg-[#1d2f5b] min-h-screen">
            <h1 className="text-7xl font-extrabold text-yellow-400 mb-12">TOTAL WORKLOAD</h1>
            <Button
                style={{ width: '30mm' }}
                className="mb-12 py-2 bg-[#e6e6e6] text-[#1d2f5b] rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] hover:bg-[#d4d4d4]"
                onClick={() => document.querySelector('input[type=file]').click()}
            >
                VÄLJ FIL
            </Button>
            <input type="file" onChange={handleFileChange} className="hidden" />
            <div className="w-full max-w-6xl grid gap-8 grid-cols-1 sm:grid-cols-2">
                {categories.map(category => (
                    <Card key={category} className="rounded-3xl bg-yellow-400 shadow-lg">
                        <CardContent className="p-8 flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-[#1d2f5b] mb-6 uppercase">{category}</h2>
                            <Button
                                className="w-full py-2 bg-[#e6e6e6] text-[#1d2f5b] rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] hover:bg-[#d4d4d4]"
                                onClick={() => handleGenerateList(category)}
                                disabled={!isFileSelected}
                            >
                                GENERERA LISTA
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
