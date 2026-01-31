# Storage Directory - Clients

This directory stores client documents organized by client ID and case ID.

## Structure

```
storage/
  clients/
    {client_id}/           # e.g., CLT-2026-00001
      cases/
        {case_id}/         # e.g., APP-2026-00001
          {documents}      # Uploaded documents
        general/           # Documents not tied to specific case
```

## Security Notes

- This directory should be outside web root in production
- Configure web server to deny direct access
- All file access should go through the API
- Files are renamed with timestamps to prevent overwrites
