import { IUserContextEntry, UserContext } from '../context/user-context';
import { JwTokenHelper } from '../helpers/jwtoken-helper';
import { ValueObject } from './value-object-base';
import jwt from 'jsonwebtoken';
import { Configuration } from '../configuration/configuration';

interface AccessTokenProps {
  value: string;
}

export class AccessToken extends ValueObject<AccessTokenProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: AccessTokenProps) {
    super(props);
  }

  public getUserContext(): UserContext {
    const userContext: IUserContextEntry = jwt.decode(
      this.value
    ) as IUserContextEntry;
    return new UserContext(userContext);
  }

  public static generate(userContext: UserContext): AccessToken {
    return new AccessToken({
      value: JwTokenHelper.generateJWToken(
        {
          id: userContext.id,
          email: userContext.email,
          refreshToken: userContext.refreshToken.value,
          role: userContext.role
        },
        Configuration.ACCESS_TOKEN_EXPIRATION_IN_SECONDS
      )
    });
  }

  public static create(value: string): AccessToken {
    jwt.verify(value, Configuration.JWTOKEN_SECRET, { ignoreExpiration: true });
    return new AccessToken({ value: value });
  }

  public static createWithoutVerifying(value: string): AccessToken {
    return new AccessToken({ value: value });
  }

  checkExpiration() {
    jwt.verify(this.value, Configuration.JWTOKEN_SECRET);
  }

  toString(): string {
    return this.value;
  }
}
