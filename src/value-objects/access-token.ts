import { Consts } from '../consts';
import { UserContext } from '../context/user-context';
import { JwTokenHelper } from '../helpers/jwtoken-helper';
import { ValueObject } from './value-object-base';

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

  public static generate(userContext: UserContext): AccessToken {
    return new AccessToken({
      value: JwTokenHelper.generateJWToken(
        {
          id: userContext.id,
          email: userContext.email,
          refreshToken: userContext.refreshToken.value,
          role: userContext.role
        },
        Consts.ACCESS_TOKEN_EXPIRATION_IN_SECONDS
      )
    });
  }

  public static create(value: string): AccessToken {
    return new AccessToken({ value: value });
  }

  toString(): string {
    return this.value;
  }
}
