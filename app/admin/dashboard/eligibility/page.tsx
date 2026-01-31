'use client';

import { useState, useEffect, useCallback } from 'react';

interface EligibilityQuestion {
  id: number;
  step_number: number;
  question_key: string;
  question_en: string;
  question_type: string;
  is_required: boolean;
  is_conditional: boolean;
  parent_question_key?: string;
  parent_answer_value?: string;
  is_active: boolean;
  display_order: number;
  options?: Array<{ value: string; label: string; icon?: string }>;
}

interface EligibilityRule {
  id?: number;
  result_type: string;
  conditions: Record<string, string | string[]>;
  priority: number;
  is_active?: boolean;
}

interface EligibilityResult {
  id: number;
  result_type: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  heading: string;
  description: string;
  primaryCTA: { text: string; action: string };
  secondaryCTA?: { text: string; action: string };
  is_active: boolean;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  eligibility_result: string;
  status: string;
  created_at: string;
}

type Tab = 'questions' | 'rules' | 'results' | 'leads';

export default function EligibilityAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('questions');
  const [questions, setQuestions] = useState<EligibilityQuestion[]>([]);
  const [rules, setRules] = useState<EligibilityRule[]>([]);
  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Edit modal states
  const [editingQuestion, setEditingQuestion] = useState<EligibilityQuestion | null>(null);
  const [editingRule, setEditingRule] = useState<{ rule: EligibilityRule; index: number } | null>(null);
  const [editingResult, setEditingResult] = useState<EligibilityResult | null>(null);
  
  // Add new modal states
  const [addingRule, setAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<EligibilityRule>({ result_type: 'likely_eligible', conditions: {}, priority: 1, is_active: true });
  const [addingResult, setAddingResult] = useState(false);
  const [newResult, setNewResult] = useState<Partial<EligibilityResult>>({ result_type: '', heading: '', description: '', icon: 'checkbox-circle', iconColor: 'text-green-500', bgColor: 'bg-green-100', primaryCTA: { text: '', action: '' }, is_active: true });

  const tabs = [
    { id: 'questions', label: 'Questions', icon: 'ri-questionnaire-line', count: questions.length },
    { id: 'rules', label: 'Rules', icon: 'ri-settings-4-line', count: rules.length },
    { id: 'results', label: 'Results', icon: 'ri-pie-chart-line', count: results.length },
    { id: 'leads', label: 'Leads', icon: 'ri-user-heart-line', count: leads.length },
  ];

  const fetchData = useCallback(async (type: string) => {
    try {
      const response = await fetch(`/api/admin/eligibility?type=${type}&locale=en`);
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch data');
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [questionsData, rulesData, resultsData, leadsData] = await Promise.all([
          fetchData('questions'),
          fetchData('rules'),
          fetchData('results'),
          fetchData('leads'),
        ]);
        setQuestions(questionsData || []);
        setRules(rulesData || []);
        setResults(resultsData || []);
        setLeads(leadsData || []);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [fetchData]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const toggleQuestionActive = async (id: number) => {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question',
          id,
          data: { ...question, is_active: !question.is_active },
        }),
      });
      const result = await response.json();
      if (result.success) {
        setQuestions(questions.map(q => 
          q.id === id ? { ...q, is_active: !q.is_active } : q
        ));
        showSuccess('Question updated successfully');
      }
    } catch (err) {
      setError('Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const saveQuestion = async (question: EligibilityQuestion) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question',
          id: question.id,
          data: question,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setQuestions(questions.map(q => q.id === question.id ? question : q));
        setEditingQuestion(null);
        showSuccess('Question saved successfully');
      }
    } catch (err) {
      setError('Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const toggleRuleActive = async (index: number) => {
    const rule = rules[index];
    if (!rule) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rule',
          id: index,
          data: { ...rule, is_active: rule.is_active === false ? true : false },
        }),
      });
      const result = await response.json();
      if (result.success) {
        setRules(rules.map((r, i) => 
          i === index ? { ...r, is_active: r.is_active === false ? true : false } : r
        ));
        showSuccess('Rule updated successfully');
      }
    } catch (err) {
      setError('Failed to update rule');
    } finally {
      setSaving(false);
    }
  };

  const saveRule = async (rule: EligibilityRule, index: number) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rule',
          id: index,
          data: rule,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setRules(rules.map((r, i) => i === index ? rule : r));
        setEditingRule(null);
        showSuccess('Rule saved successfully');
      }
    } catch (err) {
      setError('Failed to save rule');
    } finally {
      setSaving(false);
    }
  };

  const addNewRule = async () => {
    if (Object.keys(newRule.conditions).length === 0) {
      setError('Please add at least one condition');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'rule', data: newRule }),
      });
      const result = await response.json();
      if (result.success) {
        setRules([...rules, newRule]);
        setAddingRule(false);
        setNewRule({ result_type: 'likely_eligible', conditions: {}, priority: rules.length + 1, is_active: true });
        showSuccess('Rule added successfully');
      }
    } catch (err) {
      setError('Failed to add rule');
    } finally {
      setSaving(false);
    }
  };

  const deleteRule = async (index: number) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'rule', id: index }),
      });
      const result = await response.json();
      if (result.success) {
        setRules(rules.filter((_, i) => i !== index));
        showSuccess('Rule deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete rule');
    } finally {
      setSaving(false);
    }
  };

  const toggleResultActive = async (id: number) => {
    const result = results.find(r => r.id === id);
    if (!result) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'result',
          id,
          data: { ...result, is_active: !result.is_active },
        }),
      });
      const res = await response.json();
      if (res.success) {
        setResults(results.map(r => 
          r.id === id ? { ...r, is_active: !r.is_active } : r
        ));
        showSuccess('Result updated successfully');
      }
    } catch (err) {
      setError('Failed to update result');
    } finally {
      setSaving(false);
    }
  };

  const saveResult = async (result: EligibilityResult) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'result',
          id: result.id,
          data: result,
        }),
      });
      const res = await response.json();
      if (res.success) {
        setResults(results.map(r => r.id === result.id ? result : r));
        setEditingResult(null);
        showSuccess('Result saved successfully');
      }
    } catch (err) {
      setError('Failed to save result');
    } finally {
      setSaving(false);
    }
  };

  const addNewResult = async () => {
    if (!newResult.result_type || !newResult.heading) {
      setError('Please fill in result type and heading');
      return;
    }
    setSaving(true);
    try {
      const resultData = {
        ...newResult,
        id: results.length + 1,
      };
      const response = await fetch('/api/admin/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'result', data: resultData }),
      });
      const result = await response.json();
      if (result.success) {
        setResults([...results, resultData as EligibilityResult]);
        setAddingResult(false);
        setNewResult({ result_type: '', heading: '', description: '', icon: 'checkbox-circle', iconColor: 'text-green-500', bgColor: 'bg-green-100', primaryCTA: { text: '', action: '' }, is_active: true });
        showSuccess('Result added successfully');
      }
    } catch (err) {
      setError('Failed to add result');
    } finally {
      setSaving(false);
    }
  };

  const deleteResult = async (id: number) => {
    if (!confirm('Are you sure you want to delete this result?')) return;
    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'result', id }),
      });
      const result = await response.json();
      if (result.success) {
        setResults(results.filter(r => r.id !== id));
        showSuccess('Result deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete result');
    } finally {
      setSaving(false);
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/eligibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          id,
          data: { status },
        }),
      });
      const result = await response.json();
      if (result.success) {
        setLeads(leads.map(l => 
          l.id === id ? { ...l, status } : l
        ));
        showSuccess('Lead status updated');
      }
    } catch (err) {
      setError('Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const convertLeadToApplication = async (lead: Lead) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          service_type: lead.service_type,
          admin_name: 'Admin',
          sendWelcomeEmail: false,
        }),
      });
      const result = await response.json();
      if (result.success) {
        // Update lead status to converted
        await updateLeadStatus(lead.id, 'converted');
        showSuccess(`Application ${result.data.id} created for ${lead.name}`);
      } else {
        setError(result.error || 'Failed to create application');
      }
    } catch (err) {
      setError('Failed to convert lead to application');
    } finally {
      setSaving(false);
    }
  };

  const getResultBadgeColor = (type: string) => {
    switch (type) {
      case 'likely_eligible': return 'bg-green-100 text-green-800';
      case 'may_need_review': return 'bg-amber-100 text-amber-800';
      case 'contact_for_assessment': return 'bg-primary/10 text-primary';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-primary/10 text-primary';
      case 'converted': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'likely_eligible': return 'ri-checkbox-circle-line';
      case 'may_need_review': return 'ri-information-line';
      case 'contact_for_assessment': return 'ri-chat-3-line';
      default: return 'ri-question-line';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-primary animate-spin" aria-hidden="true"></i>
          <p className="mt-4 text-neutral-600">Loading eligibility configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Eligibility Flow Manager</h1>
          <p className="text-neutral-500 mt-1">
            Configure the eligibility questionnaire, rules, and outcomes
          </p>
        </div>
        <a
          href="/en/eligibility"
          target="_blank"
          className="btn-primary inline-flex items-center gap-2"
        >
          <i className="ri-eye-line" aria-hidden="true"></i>
          Preview Flow
        </a>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-xl" aria-hidden="true"></i>
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <i className="ri-error-warning-line text-xl" aria-hidden="true"></i>
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <i className="ri-close-line text-xl" aria-hidden="true"></i>
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-questionnaire-line text-xl lg:text-2xl text-primary" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-bold text-neutral-900">{questions.length}</p>
              <p className="text-xs lg:text-sm text-neutral-500">Questions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-settings-4-line text-xl lg:text-2xl text-amber-600" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-bold text-neutral-900">{rules.length}</p>
              <p className="text-xs lg:text-sm text-neutral-500">Rules</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-pie-chart-line text-xl lg:text-2xl text-green-600" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-bold text-neutral-900">{results.length}</p>
              <p className="text-xs lg:text-sm text-neutral-500">Results</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-user-heart-line text-xl lg:text-2xl text-purple-600" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-bold text-neutral-900">{leads.length}</p>
              <p className="text-xs lg:text-sm text-neutral-500">Leads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-4 lg:mb-6 -mx-4 lg:mx-0 px-4 lg:px-0 overflow-x-auto">
        <nav className="flex gap-4 lg:gap-6 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`py-3 px-1 border-b-2 font-medium text-xs lg:text-sm transition-colors flex items-center gap-1.5 lg:gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <i className={tab.icon} aria-hidden="true"></i>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`px-1.5 lg:px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="divide-y divide-neutral-100">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 rounded-t-xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                <h3 className="font-semibold text-neutral-900">Questionnaire Steps</h3>
                <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-lg w-fit">{questions.length} Questions</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                <i className="ri-information-line text-blue-500 text-lg mt-0.5 flex-shrink-0" aria-hidden="true"></i>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How to manage questions:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600 text-xs sm:text-sm">
                    <li><strong>Toggle</strong> the switch to enable/disable a question in the flow</li>
                    <li><strong>Click the pencil icon</strong> to edit question text and options</li>
                    <li>Questions marked <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-xs">Conditional</span> only appear based on previous answers</li>
                    <li>Questions marked <span className="bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded text-xs">Required</span> must be answered to continue</li>
                  </ul>
                </div>
              </div>
            </div>
            {questions.map((question) => (
              <div key={question.id} className={`p-5 ${!question.is_active ? 'bg-neutral-50 opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {question.step_number}
                      </span>
                      <span className="text-xs font-mono px-2 py-1 bg-neutral-100 rounded text-neutral-600">
                        {question.question_key}
                      </span>
                      {question.is_conditional && (
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded inline-flex items-center gap-1">
                          <i className="ri-git-branch-line" aria-hidden="true"></i>
                          Conditional
                        </span>
                      )}
                      {question.is_required && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded inline-flex items-center gap-1">
                          <i className="ri-asterisk" aria-hidden="true"></i>
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-900 font-medium mb-2">{question.question_en}</p>
                    {question.options && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {question.options.map((opt, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-neutral-100 rounded text-neutral-600 inline-flex items-center gap-1">
                            {opt.icon && <i className={`ri-${opt.icon}-line`} aria-hidden="true"></i>}
                            {opt.label}
                          </span>
                        ))}
                      </div>
                    )}
                    {question.is_conditional && (
                      <p className="text-xs text-neutral-500 mt-2">
                        Shows when: <code className="bg-neutral-100 px-1 rounded">{question.parent_question_key}</code> = <code className="bg-neutral-100 px-1 rounded">{question.parent_answer_value}</code>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingQuestion(question)}
                      className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="Edit question"
                    >
                      <i className="ri-pencil-line text-lg" aria-hidden="true"></i>
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={question.is_active}
                        onChange={() => toggleQuestionActive(question.id)}
                        disabled={saving}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="divide-y divide-neutral-100">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 rounded-t-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-neutral-900">Eligibility Rules</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-lg">{rules.length} Rules</span>
                  <button 
                    onClick={() => setAddingRule(true)}
                    className="btn-primary text-sm inline-flex items-center gap-2"
                  >
                    <i className="ri-add-line" aria-hidden="true"></i>
                    Add Rule
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <i className="ri-information-line text-blue-500 text-lg mt-0.5" aria-hidden="true"></i>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How rules work:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li><strong>Priority number</strong> determines which rule is checked first (higher = first)</li>
                    <li><strong>Conditions</strong> define what user answers trigger this result</li>
                    <li>When a user's answers match ALL conditions, they get that result</li>
                    <li><strong>Toggle</strong> the switch to enable/disable a rule</li>
                  </ul>
                </div>
              </div>
            </div>
            {rules.map((rule, index) => (
              <div key={index} className={`p-5 ${rule.is_active === false ? 'bg-neutral-50 opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-semibold text-sm">
                        {rule.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ${getResultBadgeColor(rule.result_type)}`}>
                        <i className={getResultIcon(rule.result_type)} aria-hidden="true"></i>
                        {rule.result_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-neutral-500 mb-2">Conditions:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(rule.conditions).map(([key, value], i) => (
                          <span key={i} className="text-xs font-mono px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                            {key} = {Array.isArray(value) ? value.join(' | ') : value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingRule({ rule, index })}
                      className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="Edit rule"
                    >
                      <i className="ri-pencil-line text-lg" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => deleteRule(index)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete rule"
                    >
                      <i className="ri-delete-bin-line text-lg" aria-hidden="true"></i>
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={rule.is_active !== false}
                        onChange={() => toggleRuleActive(index)}
                        disabled={saving}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="divide-y divide-neutral-100">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 rounded-t-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-neutral-900">Result Outcomes</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-lg">{results.length} Results</span>
                  <button 
                    onClick={() => setAddingResult(true)}
                    className="btn-primary text-sm inline-flex items-center gap-2"
                  >
                    <i className="ri-add-line" aria-hidden="true"></i>
                    Add Result
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <i className="ri-information-line text-blue-500 text-lg mt-0.5" aria-hidden="true"></i>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How to customize results:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li><strong>Click the pencil icon</strong> to edit the heading, description, and call-to-action buttons</li>
                    <li><strong>Primary CTA</strong> is the main action button users will see</li>
                    <li><strong>Secondary CTA</strong> is an optional secondary link/action</li>
                    <li>Each result type corresponds to rules you've configured</li>
                  </ul>
                </div>
              </div>
            </div>
            {results.map((result) => (
              <div key={result.id} className={`p-5 ${!result.is_active ? 'bg-neutral-50 opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${result.bgColor || 'bg-neutral-100'}`}>
                        <i className={`${getResultIcon(result.result_type)} text-xl ${result.iconColor || 'text-neutral-600'}`} aria-hidden="true"></i>
                      </span>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded ${getResultBadgeColor(result.result_type)}`}>
                          {result.result_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-neutral-900 font-medium mt-3">{result.heading}</p>
                    <p className="text-sm text-neutral-600 mt-1">{result.description}</p>
                    <div className="flex gap-3 mt-3">
                      {result.primaryCTA && (
                        <span className="text-xs px-3 py-1.5 bg-primary text-white rounded inline-flex items-center gap-1">
                          <i className="ri-arrow-right-line" aria-hidden="true"></i>
                          {result.primaryCTA.text} → {result.primaryCTA.action}
                        </span>
                      )}
                      {result.secondaryCTA && (
                        <span className="text-xs px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded inline-flex items-center gap-1">
                          <i className="ri-link" aria-hidden="true"></i>
                          {result.secondaryCTA.text} → {result.secondaryCTA.action}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingResult(result)}
                      className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title="Edit result"
                    >
                      <i className="ri-pencil-line text-lg" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => deleteResult(result.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete result"
                    >
                      <i className="ri-delete-bin-line text-lg" aria-hidden="true"></i>
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={result.is_active}
                        onChange={() => toggleResultActive(result.id)}
                        disabled={saving}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div>
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 rounded-t-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-neutral-900">Lead Submissions</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-lg">{leads.length} Leads</span>
                  <button className="btn-outline text-sm inline-flex items-center gap-2">
                    <i className="ri-download-line" aria-hidden="true"></i>
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <i className="ri-information-line text-blue-500 text-lg mt-0.5" aria-hidden="true"></i>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Managing leads:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li><strong>View</strong> user contact info, their service interest, and eligibility result</li>
                    <li><strong>Update status</strong> using the dropdown to track your follow-ups</li>
                    <li><strong>Export CSV</strong> to download leads for your CRM or mailing list</li>
                    <li>New submissions from the eligibility check appear here automatically</li>
                  </ul>
                </div>
              </div>
            </div>
            {leads.length === 0 ? (
              <div className="p-12 text-center">
                <i className="ri-inbox-line text-5xl text-neutral-300" aria-hidden="true"></i>
                <p className="text-neutral-500 mt-4">No leads yet. Leads will appear here when users complete the eligibility check.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Contact</th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Service</th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Result</th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Date</th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-neutral-900">{lead.name}</p>
                            <p className="text-sm text-neutral-500">{lead.email}</p>
                            <p className="text-sm text-neutral-500">{lead.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-700 capitalize">{lead.service_type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ${getResultBadgeColor(lead.eligibility_result)}`}>
                            <i className={getResultIcon(lead.eligibility_result)} aria-hidden="true"></i>
                            {lead.eligibility_result.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ${getStatusBadgeColor(lead.status)}`}>
                            {lead.status === 'new' ? 'New' : 'Converted'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            {lead.status !== 'converted' ? (
                              <button
                                onClick={() => convertLeadToApplication(lead)}
                                disabled={saving}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                <i className="ri-arrow-right-line" aria-hidden="true"></i>
                                Convert to Application
                              </button>
                            ) : (
                              <span className="text-sm text-green-600 flex items-center gap-1">
                                <i className="ri-check-line" aria-hidden="true"></i>
                                Converted
                              </span>
                            )}
                            <a
                              href={`mailto:${lead.email}`}
                              className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                              title="Send email"
                            >
                              <i className="ri-mail-line text-lg" aria-hidden="true"></i>
                            </a>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="WhatsApp"
                            >
                              <i className="ri-whatsapp-line text-lg" aria-hidden="true"></i>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-900">Edit Question</h3>
              <button onClick={() => setEditingQuestion(null)} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg">
                <i className="ri-close-line text-xl" aria-hidden="true"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Question Text (English)</label>
                <textarea
                  value={editingQuestion.question_en}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question_en: e.target.value })}
                  className="input-field w-full h-24 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Step Number</label>
                  <input
                    type="number"
                    value={editingQuestion.step_number}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, step_number: parseInt(e.target.value) })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Question Type</label>
                  <select
                    value={editingQuestion.question_type}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question_type: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="single_select">Single Select</option>
                    <option value="country">Country</option>
                    <option value="contact">Contact Form</option>
                  </select>
                </div>
              </div>
              
              {/* Options Editor */}
              {editingQuestion.question_type === 'single_select' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700">Answer Options</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = [...(editingQuestion.options || []), { value: '', label: '' }];
                        setEditingQuestion({ ...editingQuestion, options: newOptions });
                      }}
                      className="text-xs text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <i className="ri-add-line" aria-hidden="true"></i>
                      Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(editingQuestion.options || []).map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                        <input
                          type="text"
                          value={opt.value}
                          onChange={(e) => {
                            const newOptions = [...(editingQuestion.options || [])];
                            newOptions[optIndex] = { ...newOptions[optIndex], value: e.target.value };
                            setEditingQuestion({ ...editingQuestion, options: newOptions });
                          }}
                          placeholder="Value (for rules)"
                          className="input-field flex-1 text-sm"
                        />
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => {
                            const newOptions = [...(editingQuestion.options || [])];
                            newOptions[optIndex] = { ...newOptions[optIndex], label: e.target.value };
                            setEditingQuestion({ ...editingQuestion, options: newOptions });
                          }}
                          placeholder="Label (displayed)"
                          className="input-field flex-1 text-sm"
                        />
                        <select
                          value={opt.icon || ''}
                          onChange={(e) => {
                            const newOptions = [...(editingQuestion.options || [])];
                            newOptions[optIndex] = { ...newOptions[optIndex], icon: e.target.value || undefined };
                            setEditingQuestion({ ...editingQuestion, options: newOptions });
                          }}
                          className="input-field w-28 text-sm"
                        >
                          <option value="">No Icon</option>
                          <option value="government">Building</option>
                          <option value="home-2">Home</option>
                          <option value="briefcase">Briefcase</option>
                          <option value="heart">Heart</option>
                          <option value="user">User</option>
                          <option value="time">Clock</option>
                          <option value="calendar">Calendar</option>
                          <option value="check">Check</option>
                          <option value="question">Question</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = (editingQuestion.options || []).filter((_, i) => i !== optIndex);
                            setEditingQuestion({ ...editingQuestion, options: newOptions });
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <i className="ri-delete-bin-line" aria-hidden="true"></i>
                        </button>
                      </div>
                    ))}
                    {(!editingQuestion.options || editingQuestion.options.length === 0) && (
                      <div className="text-center py-3 text-neutral-400 text-sm border-2 border-dashed border-neutral-200 rounded-lg">
                        No options yet. Click "Add Option" to create answers.
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    <i className="ri-information-line" aria-hidden="true"></i> Value is used in rules (e.g., "citizenship"), Label is what users see (e.g., "Citizenship Application")
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingQuestion.is_required}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, is_required: e.target.checked })}
                    className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-700">Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingQuestion.is_conditional}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, is_conditional: e.target.checked })}
                    className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-700">Conditional</span>
                </label>
              </div>
              {editingQuestion.is_conditional && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Parent Question Key</label>
                    <select
                      value={editingQuestion.parent_question_key || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, parent_question_key: e.target.value })}
                      className="input-field w-full"
                    >
                      <option value="">Select Question...</option>
                      {questions.filter(q => q.id !== editingQuestion.id).map(q => (
                        <option key={q.question_key} value={q.question_key}>{q.question_key}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Parent Answer Value</label>
                    <input
                      type="text"
                      value={editingQuestion.parent_answer_value || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, parent_answer_value: e.target.value })}
                      className="input-field w-full"
                      placeholder="e.g., citizenship"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
              <button onClick={() => setEditingQuestion(null)} className="btn-outline">
                Cancel
              </button>
              <button onClick={() => saveQuestion(editingQuestion)} disabled={saving} className="btn-primary">
                {saving ? <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-900">Edit Rule</h3>
              <button onClick={() => setEditingRule(null)} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg">
                <i className="ri-close-line text-xl" aria-hidden="true"></i>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Help Box */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <i className="ri-lightbulb-line text-blue-500 text-lg mt-0.5" aria-hidden="true"></i>
                <p className="text-sm text-blue-700">
                  A rule triggers when <strong>all conditions</strong> match. For example: IF service = citizenship AND timeframe = urgent THEN result = May Need Review.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Result Type</label>
                  <select
                    value={editingRule.rule.result_type}
                    onChange={(e) => setEditingRule({ ...editingRule, rule: { ...editingRule.rule, result_type: e.target.value } })}
                    className="input-field w-full"
                  >
                    <option value="likely_eligible">Likely Eligible (Green)</option>
                    <option value="may_need_review">May Need Review (Yellow)</option>
                    <option value="contact_for_assessment">Contact for Assessment (Blue)</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">What result users see when this rule matches</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Priority</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingRule.rule.priority}
                    onChange={(e) => setEditingRule({ ...editingRule, rule: { ...editingRule.rule, priority: parseInt(e.target.value) || 1 } })}
                    className="input-field w-full"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Higher = checked first (1-100)</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-neutral-700">Conditions</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newConditions = { ...editingRule.rule.conditions, '': '' };
                      setEditingRule({ ...editingRule, rule: { ...editingRule.rule, conditions: newConditions } });
                    }}
                    className="text-xs text-primary hover:text-primary/80 inline-flex items-center gap-1"
                  >
                    <i className="ri-add-line" aria-hidden="true"></i>
                    Add Condition
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mb-3">Define what user answers must match for this rule to apply</p>
                
                <div className="space-y-3">
                  {Object.entries(editingRule.rule.conditions).map(([key, value], condIndex) => (
                    <div key={condIndex} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="text-xs text-neutral-500 font-medium">IF</span>
                      <select
                        value={key}
                        onChange={(e) => {
                          const newConditions = { ...editingRule.rule.conditions };
                          const oldValue = newConditions[key];
                          delete newConditions[key];
                          newConditions[e.target.value] = oldValue;
                          setEditingRule({ ...editingRule, rule: { ...editingRule.rule, conditions: newConditions } });
                        }}
                        className="input-field flex-1 text-sm"
                      >
                        <option value="">Select Question...</option>
                        {questions.map(q => (
                          <option key={q.question_key} value={q.question_key}>{q.question_key}</option>
                        ))}
                      </select>
                      <span className="text-xs text-neutral-500 font-medium">=</span>
                      <input
                        type="text"
                        value={Array.isArray(value) ? value.join(', ') : String(value)}
                        onChange={(e) => {
                          const newConditions = { ...editingRule.rule.conditions };
                          // Support comma-separated values for multiple matches
                          const inputValue = e.target.value;
                          newConditions[key] = inputValue.includes(',') 
                            ? inputValue.split(',').map(v => v.trim()) 
                            : inputValue;
                          setEditingRule({ ...editingRule, rule: { ...editingRule.rule, conditions: newConditions } });
                        }}
                        placeholder="Answer value(s)"
                        className="input-field flex-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newConditions = { ...editingRule.rule.conditions };
                          delete newConditions[key];
                          setEditingRule({ ...editingRule, rule: { ...editingRule.rule, conditions: newConditions } });
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove condition"
                      >
                        <i className="ri-delete-bin-line" aria-hidden="true"></i>
                      </button>
                    </div>
                  ))}
                  
                  {Object.keys(editingRule.rule.conditions).length === 0 && (
                    <div className="text-center py-4 text-neutral-400 text-sm border-2 border-dashed border-neutral-200 rounded-lg">
                      <i className="ri-filter-off-line text-2xl mb-2" aria-hidden="true"></i>
                      <p>No conditions yet. Click "Add Condition" to start.</p>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-neutral-500 mt-2">
                  <i className="ri-information-line" aria-hidden="true"></i> Tip: Use comma-separated values for multiple matches (e.g., "citizenship, residency")
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
              <button onClick={() => setEditingRule(null)} className="btn-outline">
                Cancel
              </button>
              <button onClick={() => saveRule(editingRule.rule, editingRule.index)} disabled={saving} className="btn-primary">
                {saving ? <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Result Modal */}
      {editingResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-900">Edit Result</h3>
              <button onClick={() => setEditingResult(null)} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg">
                <i className="ri-close-line text-xl" aria-hidden="true"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={editingResult.heading}
                  onChange={(e) => setEditingResult({ ...editingResult, heading: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  value={editingResult.description}
                  onChange={(e) => setEditingResult({ ...editingResult, description: e.target.value })}
                  className="input-field w-full h-24 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Primary CTA Text</label>
                  <input
                    type="text"
                    value={editingResult.primaryCTA?.text || ''}
                    onChange={(e) => setEditingResult({ ...editingResult, primaryCTA: { ...editingResult.primaryCTA, text: e.target.value } })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Primary CTA Link</label>
                  <input
                    type="text"
                    value={editingResult.primaryCTA?.action || ''}
                    onChange={(e) => setEditingResult({ ...editingResult, primaryCTA: { ...editingResult.primaryCTA, action: e.target.value } })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Secondary CTA Text</label>
                  <input
                    type="text"
                    value={editingResult.secondaryCTA?.text || ''}
                    onChange={(e) => setEditingResult({ ...editingResult, secondaryCTA: { ...editingResult.secondaryCTA, text: e.target.value, action: editingResult.secondaryCTA?.action || '' } })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Secondary CTA Link</label>
                  <input
                    type="text"
                    value={editingResult.secondaryCTA?.action || ''}
                    onChange={(e) => setEditingResult({ ...editingResult, secondaryCTA: { text: editingResult.secondaryCTA?.text || '', action: e.target.value } })}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
              <button onClick={() => setEditingResult(null)} className="btn-outline">
                Cancel
              </button>
              <button onClick={() => saveResult(editingResult)} disabled={saving} className="btn-primary">
                {saving ? <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {addingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-900">Add New Rule</h3>
              <button onClick={() => setAddingRule(false)} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg">
                <i className="ri-close-line text-xl" aria-hidden="true"></i>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <i className="ri-lightbulb-line text-blue-500 text-lg mt-0.5" aria-hidden="true"></i>
                <p className="text-sm text-blue-700">
                  Create a rule to determine eligibility. Rules check user answers and return a result type.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Result Type</label>
                  <select
                    value={newRule.result_type}
                    onChange={(e) => setNewRule({ ...newRule, result_type: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="likely_eligible">Likely Eligible (Green)</option>
                    <option value="may_need_review">May Need Review (Yellow)</option>
                    <option value="contact_for_assessment">Contact for Assessment (Blue)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Priority</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newRule.priority}
                    onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) || 1 })}
                    className="input-field w-full"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Higher = checked first</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-neutral-700">Conditions</label>
                  <button
                    type="button"
                    onClick={() => setNewRule({ ...newRule, conditions: { ...newRule.conditions, '': '' } })}
                    className="text-xs text-primary hover:text-primary/80 inline-flex items-center gap-1"
                  >
                    <i className="ri-add-line" aria-hidden="true"></i>
                    Add Condition
                  </button>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(newRule.conditions).map(([key, value], condIndex) => (
                    <div key={condIndex} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="text-xs text-neutral-500 font-medium">IF</span>
                      <select
                        value={key}
                        onChange={(e) => {
                          const newConditions = { ...newRule.conditions };
                          const oldValue = newConditions[key];
                          delete newConditions[key];
                          newConditions[e.target.value] = oldValue;
                          setNewRule({ ...newRule, conditions: newConditions });
                        }}
                        className="input-field flex-1 text-sm"
                      >
                        <option value="">Select Question...</option>
                        {questions.map(q => (
                          <option key={q.question_key} value={q.question_key}>{q.question_key}</option>
                        ))}
                      </select>
                      <span className="text-xs text-neutral-500 font-medium">=</span>
                      <input
                        type="text"
                        value={Array.isArray(value) ? value.join(', ') : String(value)}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setNewRule({
                            ...newRule,
                            conditions: {
                              ...newRule.conditions,
                              [key]: inputValue.includes(',') ? inputValue.split(',').map(v => v.trim()) : inputValue
                            }
                          });
                        }}
                        placeholder="Answer value(s)"
                        className="input-field flex-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newConditions = { ...newRule.conditions };
                          delete newConditions[key];
                          setNewRule({ ...newRule, conditions: newConditions });
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <i className="ri-delete-bin-line" aria-hidden="true"></i>
                      </button>
                    </div>
                  ))}
                  
                  {Object.keys(newRule.conditions).length === 0 && (
                    <div className="text-center py-4 text-neutral-400 text-sm border-2 border-dashed border-neutral-200 rounded-lg">
                      <i className="ri-filter-off-line text-2xl mb-2" aria-hidden="true"></i>
                      <p>No conditions yet. Click "Add Condition" to start.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
              <button onClick={() => setAddingRule(false)} className="btn-outline">Cancel</button>
              <button onClick={addNewRule} disabled={saving} className="btn-primary">
                {saving ? <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i> : 'Add Rule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Result Modal */}
      {addingResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-900">Add New Result</h3>
              <button onClick={() => setAddingResult(false)} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg">
                <i className="ri-close-line text-xl" aria-hidden="true"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <i className="ri-lightbulb-line text-blue-500 text-lg mt-0.5" aria-hidden="true"></i>
                <p className="text-sm text-blue-700">
                  Create a result outcome that users will see based on their eligibility. English is required, Arabic is optional.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Result Type (unique identifier)</label>
                <input
                  type="text"
                  value={newResult.result_type || ''}
                  onChange={(e) => setNewResult({ ...newResult, result_type: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="e.g., likely_eligible, needs_more_info"
                  className="input-field w-full"
                />
                <p className="text-xs text-neutral-500 mt-1">Use lowercase with underscores. This is used in rules.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Icon</label>
                  <select
                    value={newResult.icon || 'checkbox-circle'}
                    onChange={(e) => setNewResult({ ...newResult, icon: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="checkbox-circle">Checkmark (Success)</option>
                    <option value="information">Info</option>
                    <option value="chat-3">Chat</option>
                    <option value="question">Question</option>
                    <option value="error-warning">Warning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Color Theme</label>
                  <select
                    value={newResult.bgColor || 'bg-green-100'}
                    onChange={(e) => {
                      const colorMap: Record<string, string> = {
                        'bg-green-100': 'text-green-500',
                        'bg-amber-100': 'text-amber-500',
                        'bg-blue-100': 'text-blue-500',
                        'bg-red-100': 'text-red-500',
                      };
                      setNewResult({ ...newResult, bgColor: e.target.value, iconColor: colorMap[e.target.value] || 'text-green-500' });
                    }}
                    className="input-field w-full"
                  >
                    <option value="bg-green-100">Green (Success)</option>
                    <option value="bg-amber-100">Amber (Review)</option>
                    <option value="bg-blue-100">Blue (Info)</option>
                    <option value="bg-red-100">Red (Alert)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Heading (English) *</label>
                <input
                  type="text"
                  value={newResult.heading || ''}
                  onChange={(e) => setNewResult({ ...newResult, heading: e.target.value })}
                  placeholder="e.g., Great News! You're Likely Eligible"
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description (English) *</label>
                <textarea
                  value={newResult.description || ''}
                  onChange={(e) => setNewResult({ ...newResult, description: e.target.value })}
                  placeholder="Describe what this result means for the user..."
                  className="input-field w-full h-20 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={newResult.primaryCTA?.text || ''}
                    onChange={(e) => setNewResult({ ...newResult, primaryCTA: { text: e.target.value, action: newResult.primaryCTA?.action || '' } })}
                    placeholder="e.g., Book a Consultation"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={newResult.primaryCTA?.action || ''}
                    onChange={(e) => setNewResult({ ...newResult, primaryCTA: { text: newResult.primaryCTA?.text || '', action: e.target.value } })}
                    placeholder="/book or https://..."
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
              <button onClick={() => setAddingResult(false)} className="btn-outline">Cancel</button>
              <button onClick={addNewResult} disabled={saving} className="btn-primary">
                {saving ? <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i> : 'Add Result'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
