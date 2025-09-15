import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
  private readonly tokens = new Set<string>();

  add(token: string) {
    this.tokens.add(token);
  }

  has(token: string): boolean {
    return this.tokens.has(token);
  }
}
