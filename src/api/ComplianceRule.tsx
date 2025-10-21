const ComplianceRule = {
    async list() {
        const response = await fetch('/api/compliance-rules');
        if (!response.ok) {
            throw new Error('Failed to fetch compliance rules');
        }
        return await response.json();
    }
};

export default ComplianceRule;