'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormData {
  [key: string]: string;
}

interface SavedRecord extends FormData {
  id: number;
}

const ImageViewer = ({ src }: { src: string }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSize({
        width: img.width,
        height: img.height
      });
    };
  }, [src]);

  return (
    <div 
      className="mt-4 bg-white border rounded overflow-auto"
      style={{
        height: imageSize.height ? imageSize.height / 8 : 400,
        width: imageSize.width || '100%'
      }}
    >
      <img 
        ref={imgRef}
        src={src}
        alt="Document Preview"
        className="min-w-full"
        style={{
          width: imageSize.width || '100%',
          height: 'auto'
        }}
      />
    </div>
  );
};

const CreditCardForm = () => {
  const [activeTab, setActiveTab] = useState('phase1');
  const [formData, setFormData] = useState<FormData>({});
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  const [imageSrc, setImageSrc] = useState('/api/placeholder/800/400');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FormField = ({ label, name }: { label: string; name: string }) => (
    <div className="flex items-center mb-2">
      <label className="w-48 text-sm">{label}</label>
      <input
        type="text"
        name={name}
        value={formData[name] || ''}
        onChange={handleInputChange}
        className="flex-1 p-1 border bg-white rounded"
      />
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    const phases = ['phase1', 'phase2', 'phase3', 'summary'];
    const currentIndex = phases.indexOf(activeTab);
    if (currentIndex < phases.length - 1) {
      setActiveTab(phases[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const phases = ['phase1', 'phase2', 'phase3', 'summary'];
    const currentIndex = phases.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(phases[currentIndex - 1]);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setImageSrc(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNew = () => {
    setFormData({});
    setImageSrc('/api/placeholder/800/400');
  };

  const handleSave = () => {
    const newRecord = {
      id: Date.now(),
      ...formData
    };
    setSavedRecords(prev => [...prev, newRecord]);

    const headers = Object.keys(formData).join(',');
    const values = Object.values(formData).join(',');
    const csvContent = `${headers}\n${values}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit_card_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        
        <div className="flex-grow mr-4">
          <Card className="bg-gray-300">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 bg-transparent border-b border-gray-400">
                  <TabsTrigger value="phase1" className="bg-transparent">Phase1</TabsTrigger>
                  <TabsTrigger value="phase2" className="bg-transparent">Phase2</TabsTrigger>
                  <TabsTrigger value="phase3" className="bg-transparent">Phase3</TabsTrigger>
                  <TabsTrigger value="summary" className="bg-transparent">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="phase1">
                  <div className="grid grid-cols-2 gap-x-8">
                    <div>
                      <FormField label="Image Name" name="imageName" />
                      <FormField label="Record No." name="recordNo" />
                      <FormField label="Customer ID" name="customerId" />
                      <FormField label="Card Issue Type" name="cardIssueType" />
                      <FormField label="Card Limit" name="cardLimit" />
                      <FormField label="Average Monthly Usage" name="averageMonthlyUsage" />
                    </div>
                    <div>
                      <FormField label="Does Credit card providence life insurance" name="creditCardProvidence" />
                      <FormField label="Average Monthly Payment" name="averageMonthlyPayment" />
                      <FormField label="Card Issuer Date" name="cardIssuerDate" />
                      <FormField label="Card Holder Name" name="cardHolderName" />
                      <FormField label="Card Holder DOB" name="cardHolderDOB" />
                      <FormField label="Attorney Docket No" name="attorneyDocketNo" />
                      <FormField label="Remarks1" name="remarks1" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="phase2">
                  <div className="grid grid-cols-2 gap-x-8">
                    <div>
                      <FormField label="Sex_1" name="sex1" />
                      <FormField label="Register Address" name="registerAddress" />
                      <FormField label="Card Type" name="cardType" />
                      <FormField label="Rate of interest Type" name="rateOfInterestType" />
                      <FormField label="FICO Credit Score" name="ficoCreditScore" />
                      <FormField label="City_1" name="city1" />
                    </div>
                    <div>
                      <FormField label="Province_1" name="province1" />
                      <FormField label="Zip_1" name="zip1" />
                      <FormField label="Remarks2" name="remarks2" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="phase3">
                  <div className="grid grid-cols-2 gap-x-8">
                    <div>
                      <FormField label="Beneficiary Name" name="beneficiaryName" />
                      <FormField label="Alternate Address" name="alternateAddress" />
                      <FormField label="Beneficiary D.O.B" name="beneficiaryDOB" />
                      <FormField label="City_2" name="city2" />
                      <FormField label="Province_2" name="province2" />
                      <FormField label="Zip_2" name="zip2" />
                    </div>
                    <div>
                      <FormField label="Country" name="country" />
                      <FormField label="Blood Group" name="bloodGroup" />
                      <FormField label="Sex_2" name="sex2" />
                      <FormField label="Card Expiry Date" name="cardExpiryDate" />
                      <FormField label="Credit Card Account Number" name="creditCardAccountNumber" />
                      <FormField label="IDON Customer Number" name="idonCustomerNumber" />
                      <FormField label="Remarks3" name="remarks3" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="summary">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border text-left">Record No.</th>
                          <th className="p-2 border text-left">Customer ID</th>
                          <th className="p-2 border text-left">Card Holder Name</th>
                          <th className="p-2 border text-left">Card Type</th>
                          <th className="p-2 border text-left">Card Limit</th>
                          <th className="p-2 border text-left">Country</th>
                          <th className="p-2 border text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="p-2 border">{record.recordNo}</td>
                            <td className="p-2 border">{record.customerId}</td>
                            <td className="p-2 border">{record.cardHolderName}</td>
                            <td className="p-2 border">{record.cardType}</td>
                            <td className="p-2 border">{record.cardLimit}</td>
                            <td className="p-2 border">{record.country}</td>
                            <td className="p-2 border">Active</td>
                          </tr>
                        ))}
                        {savedRecords.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-gray-500">
                              No records found. Save a record to see it here.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <div className="mt-6 flex justify-end gap-2">
                  {activeTab !== 'phase1' && (
                    <button 
                      onClick={handlePrev}
                      className="px-4 py-1 bg-white rounded border"
                    >
                      Prev
                    </button>
                  )}
                  {activeTab !== 'summary' && (
                    <button 
                      onClick={handleNext}
                      className="px-4 py-1 bg-white rounded border"
                    >
                      Next
                    </button>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <ImageViewer src={imageSrc} />
        </div>

        <div className="w-28 space-y-2">
          <button onClick={handleBrowse} className="w-full py-1 px-4 bg-white border rounded">Browse</button>
          <button onClick={handleNew} className="w-full py-1 px-4 bg-white border rounded">New</button>
          <button onClick={handleSave} className="w-full py-1 px-4 bg-white border rounded">Save</button>
          <button className="w-full py-1 px-4 bg-white border rounded">Edit</button>
          <button className="w-full py-1 px-4 bg-white border rounded">Update</button>
          <button className="w-full py-1 px-4 bg-white border rounded">Delete</button>
          <button className="w-full py-1 px-4 bg-white border rounded">Cancel</button>
          <button className="w-full py-1 px-4 bg-white border rounded">Search City</button>
          <button className="w-full py-1 px-4 bg-white border rounded">Exit</button>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;