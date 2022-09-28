{{/*
Expand the name of the chart.
*/}}
{{- define "rdxworks-storybook.name" -}}
{{- default .Chart.Name .Values.storybook.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "rdxworks-storybook.fullname" -}}
{{- if .Values.storybook.fullnameOverride }}
{{- .Values.storybook.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.storybook.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "rdxworks-storybook.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "rdxworks-storybook.labels" -}}
helm.sh/chart: {{ include "rdxworks-storybook.chart" . }}
{{ include "rdxworks-storybook.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "rdxworks-storybook.selectorLabels" -}}
app.kubernetes.io/name: {{ include "rdxworks-storybook.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "rdxworks-storybook.serviceAccountName" -}}
{{- if .Values.storybook.serviceAccount.create }}
{{- default (include "rdxworks-storybook.fullname" .) .Values.storybook.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.storybook.serviceAccount.name }}
{{- end }}
{{- end }}