import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Upload, Shield, FileText, CreditCard, Building2 } from 'lucide-react';
import FileUpload from './FileUpload';
import SpeechRecognition from './SpeechRecognition';

interface FormData {
  fullName: string;
  aadharNumber: string;
  panNumber: string;
  dateOfBirth: string;
  annualIncome: string;
  employmentStatus: string;
  monthlyDebtPayments: string;
  mobileNumber: string;
  emailAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
}

interface FileUploads {
  aadharCard: File | null;
  panCard: File | null;
  salarySlips: File | null;
  bankStatement: File | null;
}

const CreditVerificationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    aadharNumber: '',
    panNumber: '',
    dateOfBirth: '',
    annualIncome: '',
    employmentStatus: '',
    monthlyDebtPayments: '',
    mobileNumber: '',
    emailAddress: '',
    streetAddress: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [files, setFiles] = useState<FileUploads>({
    aadharCard: null,
    panCard: null,
    salarySlips: null,
    bankStatement: null,
  });

  const [currentSpeechField, setCurrentSpeechField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: keyof FileUploads, file: File) => {
    setFiles(prev => ({ ...prev, [field]: file }));
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded for ${field}.`,
    });
  };

  const handleSpeechResult = (field: string, result: string) => {
    handleInputChange(field, result);
    setCurrentSpeechField(null);
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'fullName', 'aadharNumber', 'panNumber', 'dateOfBirth', 'annualIncome',
      'employmentStatus', 'monthlyDebtPayments', 'mobileNumber', 'emailAddress',
      'streetAddress', 'city', 'state', 'pinCode'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    const requiredFiles = ['aadharCard', 'panCard', 'salarySlips', 'bankStatement'];
    const missingFiles = requiredFiles.filter(file => !files[file as keyof FileUploads]);
    
    if (missingFiles.length > 0) {
      toast({
        title: "Missing Required Documents",
        description: "Please upload all required documents.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted Successfully",
        description: "Your credit verification application has been submitted for review.",
      });
      
      // Reset form
      setFormData({
        fullName: '', aadharNumber: '', panNumber: '', dateOfBirth: '',
        annualIncome: '', employmentStatus: '', monthlyDebtPayments: '',
        mobileNumber: '', emailAddress: '', streetAddress: '', city: '',
        state: '', pinCode: '',
      });
      setFiles({
        aadharCard: null, panCard: null, salarySlips: null, bankStatement: null,
      });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Credit Verification Portal
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Secure and comprehensive credit verification process. Fill in your details and upload required documents to proceed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Personal Information */}
          <Card className="shadow-form animate-scale-in">
            <CardHeader>
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 text-primary mr-2" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>
                Please provide your basic personal details for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('fullName', result)}
                      isActive={currentSpeechField === 'fullName'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'fullName' ? null : 'fullName')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('dateOfBirth', result)}
                      isActive={currentSpeechField === 'dateOfBirth'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'dateOfBirth' ? null : 'dateOfBirth')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={12}
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('aadharNumber', result.replace(/\D/g, ''))}
                      isActive={currentSpeechField === 'aadharNumber'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'aadharNumber' ? null : 'aadharNumber')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('panNumber', result.toUpperCase())}
                      isActive={currentSpeechField === 'panNumber'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'panNumber' ? null : 'panNumber')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="shadow-form animate-scale-in">
            <CardHeader>
              <div className="flex items-center">
                <Building2 className="w-6 h-6 text-primary mr-2" />
                <CardTitle>Financial Information</CardTitle>
              </div>
              <CardDescription>
                Provide your employment and financial details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (₹) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="annualIncome"
                      type="number"
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                      placeholder="Enter your annual income"
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('annualIncome', result.replace(/\D/g, ''))}
                      isActive={currentSpeechField === 'annualIncome'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'annualIncome' ? null : 'annualIncome')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyDebtPayments">Existing Monthly Debt Payments (₹) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="monthlyDebtPayments"
                      type="number"
                      value={formData.monthlyDebtPayments}
                      onChange={(e) => handleInputChange('monthlyDebtPayments', e.target.value)}
                      placeholder="Enter monthly debt payments"
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('monthlyDebtPayments', result.replace(/\D/g, ''))}
                      isActive={currentSpeechField === 'monthlyDebtPayments'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'monthlyDebtPayments' ? null : 'monthlyDebtPayments')}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="employmentStatus">Employment Status *</Label>
                  <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed-fulltime">Employed (Full-time)</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-form animate-scale-in">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Provide your contact details and address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      placeholder="Enter your mobile number"
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('mobileNumber', result.replace(/\D/g, ''))}
                      isActive={currentSpeechField === 'mobileNumber'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'mobileNumber' ? null : 'mobileNumber')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('emailAddress', result)}
                      isActive={currentSpeechField === 'emailAddress'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'emailAddress' ? null : 'emailAddress')}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="streetAddress"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      placeholder="Enter your street address"
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('streetAddress', result)}
                      isActive={currentSpeechField === 'streetAddress'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'streetAddress' ? null : 'streetAddress')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city"
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('city', result)}
                      isActive={currentSpeechField === 'city'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'city' ? null : 'city')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter your state"
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('state', result)}
                      isActive={currentSpeechField === 'state'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'state' ? null : 'state')}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="pinCode">Pin Code *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      placeholder="Enter your pin code"
                      maxLength={6}
                      className="flex-1"
                      required
                    />
                    <SpeechRecognition
                      onResult={(result) => handleSpeechResult('pinCode', result.replace(/\D/g, ''))}
                      isActive={currentSpeechField === 'pinCode'}
                      onToggle={() => setCurrentSpeechField(currentSpeechField === 'pinCode' ? null : 'pinCode')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="shadow-form animate-scale-in">
            <CardHeader>
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-primary mr-2" />
                <CardTitle>Required Documents</CardTitle>
              </div>
              <CardDescription>
                Please upload the following documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                  label="Aadhar Card"
                  accept="image/*,.pdf"
                  onFileSelect={(file) => handleFileUpload('aadharCard', file)}
                  currentFile={files.aadharCard}
                />
                <FileUpload
                  label="PAN Card"
                  accept="image/*,.pdf"
                  onFileSelect={(file) => handleFileUpload('panCard', file)}
                  currentFile={files.panCard}
                />
                <FileUpload
                  label="3 Month Salary Slips"
                  accept=".pdf,.doc,.docx,image/*"
                  onFileSelect={(file) => handleFileUpload('salarySlips', file)}
                  currentFile={files.salarySlips}
                />
                <FileUpload
                  label="6 Month Bank Statement"
                  accept=".pdf,.doc,.docx"
                  onFileSelect={(file) => handleFileUpload('bankStatement', file)}
                  currentFile={files.bankStatement}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              variant="trust" 
              size="lg" 
              disabled={isSubmitting}
              className="px-8 py-4 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting Application...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Submit Credit Verification
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditVerificationForm;