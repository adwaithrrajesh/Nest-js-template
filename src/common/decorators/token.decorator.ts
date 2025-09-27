import { SetMetadata } from '@nestjs/common';
import { TOKEN_TYPE_KEY } from 'common/guard/jwt.user.guard';

export const TokenType = (type: 'access' | 'refresh') => SetMetadata(TOKEN_TYPE_KEY, type);
