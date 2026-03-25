import path from 'path';

import {
  type AnalysisResult,
  type Complexity,
  type KeyPoint,
  type LinkInfo,
  type SummaryRenderOptions,
  type TechnicalDetails
} from '../types';

export class SummaryGenerator {
  public generateDocument(results: readonly AnalysisResult[], options: SummaryRenderOptions): string {
    const lines: string[] = [];
    const orderedResults = [...results].sort((left, right) =>
      left.metadata.filePath.localeCompare(right.metadata.filePath)
    );

    lines.push('# Markdown Summary Report');
    lines.push('');
    lines.push(`- Generated: ${options.generatedAt}`);
    lines.push(`- Source directory: ${this.normalizePath(options.sourceDirectory)}`);
    lines.push(`- Output path: ${this.normalizePath(options.outputPath)}`);
    lines.push(`- Files analyzed: ${orderedResults.length}`);
    lines.push(`- Grouping mode: ${options.grouped ? 'grouped by complexity' : 'sequential'}`);
    lines.push('');
    lines.push('## Aggregate Statistics');
    lines.push('');
    lines.push(`- Beginner: ${orderedResults.filter((result) => result.metadata.complexity === 'beginner').length}`);
    lines.push(
      `- Intermediate: ${orderedResults.filter((result) => result.metadata.complexity === 'intermediate').length}`
    );
    lines.push(`- Advanced: ${orderedResults.filter((result) => result.metadata.complexity === 'advanced').length}`);
    lines.push(`- Total words: ${orderedResults.reduce((sum, result) => sum + result.metadata.wordCount, 0)}`);
    lines.push(`- Total code examples: ${orderedResults.reduce((sum, result) => sum + result.codeExamples.length, 0)}`);
    lines.push('');
    lines.push('## Table of Contents');
    lines.push('');

    for (const result of orderedResults) {
      const anchor = this.toAnchor(result.metadata.title);
      lines.push(
        `- ${result.metadata.icon} [${result.metadata.title}](#${anchor}) — ${this.complexityBadge(
          result.metadata.complexity
        )}`
      );
    }

    if (orderedResults.length === 0) {
      lines.push('');
      lines.push('No markdown files were analyzed.');
      return lines.join('\n');
    }

    if (options.grouped) {
      this.renderGroupedSections(lines, orderedResults);
    } else {
      lines.push('');
      lines.push('## File Summaries');
      lines.push('');
      for (const result of orderedResults) {
        this.renderResult(lines, result);
      }
    }

    return lines.join('\n').trimEnd() + '\n';
  }

  private renderGroupedSections(lines: string[], results: readonly AnalysisResult[]): void {
    const groups: readonly Complexity[] = ['beginner', 'intermediate', 'advanced'];

    for (const complexity of groups) {
      const groupResults = results.filter((result) => result.metadata.complexity === complexity);

      if (groupResults.length === 0) {
        continue;
      }

      lines.push('');
      lines.push(`## ${this.capitalize(complexity)} Documents`);
      lines.push('');

      for (const result of groupResults) {
        this.renderResult(lines, result);
      }
    }
  }

  private renderResult(lines: string[], result: AnalysisResult): void {
    lines.push(`### ${result.metadata.icon} ${result.metadata.title}`);
    lines.push('');
    lines.push(`- File: ${path.basename(result.metadata.filePath)}`);
    lines.push(`- Path: ${result.metadata.filePath}`);
    lines.push(`- Read time: ${result.metadata.readTimeMinutes} min`);
    lines.push(`- Complexity: ${this.complexityBadge(result.metadata.complexity)}`);
    lines.push(`- Audience: ${result.metadata.audience.join(', ')}`);
    lines.push(`- Words: ${result.metadata.wordCount}`);
    lines.push('');
    lines.push(result.summary);
    lines.push('');

    if (result.keyPoints.length > 0) {
      lines.push('#### Key Points');
      lines.push('');
      for (const keyPoint of result.keyPoints) {
        lines.push(`- ${this.significanceIcon(keyPoint)} ${keyPoint.text}`);
      }
      lines.push('');
    }

    this.renderTechnicalDetails(lines, result.technicalDetails);

    if (result.structure.length > 0) {
      lines.push('#### Structure');
      lines.push('');
      for (const heading of result.structure) {
        const indent = '  '.repeat(Math.max(0, heading.depth - 1));
        lines.push(`- ${indent}${this.significanceMarker(heading.significance)} ${heading.text}`);
      }
      lines.push('');
    }

    lines.push('#### Code Examples');
    lines.push('');
    lines.push(`- Count: ${result.codeExamples.length}`);

    if (result.codeExamples.length > 0) {
      for (const example of result.codeExamples.slice(0, 3)) {
        lines.push(`- ${example.language} (${example.lineCount} lines)`);
      }
    }

    lines.push('');
    this.renderLinks(lines, result.links);
  }

  private renderTechnicalDetails(lines: string[], details: TechnicalDetails): void {
    const sections: Array<{ label: string; values: readonly string[] }> = [
      { label: 'Languages', values: details.languages },
      { label: 'Frameworks', values: details.frameworks },
      { label: 'Concepts', values: details.concepts },
      { label: 'APIs', values: details.apis },
      { label: 'Commands', values: details.commands }
    ].filter((section) => section.values.length > 0);

    if (sections.length === 0) {
      return;
    }

    lines.push('#### Technical Details');
    lines.push('');

    for (const section of sections) {
      lines.push(`- ${section.label}: ${section.values.join(', ')}`);
    }

    lines.push('');
  }

  private renderLinks(lines: string[], links: readonly LinkInfo[]): void {
    lines.push('#### Important Links');
    lines.push('');

    if (links.length === 0) {
      lines.push('- None');
      lines.push('');
      return;
    }

    for (const link of links.slice(0, 8)) {
      lines.push(`- [${link.text}](${link.url}) (${link.category})`);
    }

    lines.push('');
  }

  private complexityBadge(complexity: Complexity): string {
    if (complexity === 'advanced') {
      return '🔴 advanced';
    }

    if (complexity === 'intermediate') {
      return '🟠 intermediate';
    }

    return '🟢 beginner';
  }

  private significanceIcon(keyPoint: KeyPoint): string {
    if (keyPoint.significance === 'high') {
      return '⭐';
    }

    if (keyPoint.significance === 'medium') {
      return '•';
    }

    return '◦';
  }

  private significanceMarker(significance: 'high' | 'medium' | 'low'): string {
    if (significance === 'high') {
      return '[high]';
    }

    if (significance === 'medium') {
      return '[medium]';
    }

    return '[low]';
  }

  private toAnchor(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  private normalizePath(value: string): string {
    return value.replace(/\\/g, '/');
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
